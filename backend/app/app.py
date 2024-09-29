from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, emit, leave_room
from flask_cors import CORS
import hashlib
import db_functions as db_functions
from openai import OpenAI
import os
from dotenv import load_dotenv


app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins='*')  

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

rooms = {}


difficulty = {
    "master": "The topic should be serious, semi formal, a little longer than the avgerage text message. Topic should not need any extensive previous background.",
    "seasoned": "Topic that are a little more personal, opinionated, and a little less casual in topic. Also, use topics that do not require long responses.Topic should not need any extensive previous background.",
    "novice": "topics that only really need one sentence per response from the user, extremely casual in topic and tone. Topic needs to be not serious. Topic should not need any extensive previous background."
}

def hash_string(string):
    # Create a hash object using SHA-256
    hash_object = hashlib.sha256(string.encode())
    # Convert the hash to a hexadecimal string
    hash_hex = hash_object.hexdigest()
    return hash_hex

# --------------- Sockets ---------------

@socketio.on('create_room')
def handle_create_room(data):
    print("Creating room...\n")
    creator = data['creator']
    room = hash_string(creator)
    print("Room created successfully.\n")
    db_functions.create_lobby(room, data['creator_id'], data['game_mode'], data['difficulty'], data['max_players'])
    players = db_functions.view_lobby(room)
    join_room(room)
    emit('room_created', {'message': f'Room {room} created for {creator}', 'room': room, 'creator': creator, 'players': players}, room=request.sid)

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    user = data['user']
    if db_functions.join_lobby(room, data['user_id']) == -1:
        emit('room_joined', {'message': f'Room {room} is full', 'room': room, 'user': user, 'players': players, 'status': -1}, room=request.sid)
        return
    players = db_functions.view_lobby(room)
    join_room(room)
    print(f'User {user} joined room {room}.')
    emit('room_joined', {'message': f'User joined {room}', 'room': room, 'user': user, 'players': players, 'status': 0}, room=request.sid)
    emit('room_updated', {'message': f'User joined {room}', 'room': room, 'user': user, 'players': players}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    user = data['user']
    print("APDOKWAPDOAWD")
    db_functions.leave_lobby(room, data['user_id'])
    players = db_functions.view_lobby(room)
    print(players)
    leave_room(room)
    emit('room_updated', {'message': f'User left {room}', 'room': room, 'user': user, 'players': players}, room=room)

# --------------- OpenAI Functions ---------------

@app.route('/generate_prompt', methods=['POST'])
def handle_generate_prompt(prompt_diffculty):
    generated_prompt = generate_prompt(prompt_diffculty)
    return jsonify({'generated_text': generated_prompt}), 200

@app.route('/generate_prompt', methods=['POST'])
def handle_ai_response_prompt(previous_conversation, prompt):
    generated_prompt = ai_response_prompt(previous_conversation, prompt)
    return jsonify({'ai_response_text': generated_prompt}), 200


def generate_prompt(prompt_diffculty):
    response = client.chat.completions.create(model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an useful program that will do anything to help the user, making sure you satisfy the user to the best of your abilities"},
        {"role": "user", "content": f"Generate me an conversation topic is likely to show up in people's lives. that is 2 sentences long, that are designed to be graded for english texting fluency, make sure the conversation is engaging and interesting. make it sound as human as possible. {difficulty[prompt_diffculty]}"}
    ])
    return jsonify({"status": "success", "content": response.choices[0].message.content.strip()})

# TODO: check if there could be too many words, might cause crash
@app.route('/ai_response', methods=['POST'])
def ai_response_prompt():
    data = request.json
    previous_conversation = data.get("previous_conversation")
    prompt = data.get("prompt")
    thread_id = data.get("thread_id")
    print(data)
    print("here's the data")
    print(previous_conversation)
    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "you said: "
        else:
            prev_convo += "the other person said: "
        is_AI = not is_AI
        prev_convo += convo["text"] + "\n"
    response = client.chat.completions.create(model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an competent but easy conversation program, you should behave like one, that is trying to have a normal conversation with the user, make sure you best mimic how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Generate me the a starting piece to this prompt like an online text conversation, try to come up with personalized example based on the prompt, include that in the first reponse, keep the responses between 1 to 2 sentences, only include what you say to the person in the response."}
    ])
    return jsonify({"status": "success", "content": response.choices[0].message.content.strip()})

@app.route('/ai_grade', methods=['POST'])
def grade_user_responses():
    data = request.json
    previous_conversation = data.get("previous_conversation")
    prompt = data.get("prompt")
    game_id = data.get("game_id")
    message_id = data.get("message_id")
    user_id = data.get("user_id")

    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "you said: "
        else:
            prev_convo += "the other person said: "
        is_AI = not is_AI
        prev_convo += convo + "\n"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a competent grading program that has no bias. You should behave like one. Make sure you take into account how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Focusing on the latest response from the other person, give me a grade out of 100 for the following: Flow, Conciseness, Clarity, and On Topic. Please provide the grades in the following format, don't include any puntucation except : and , : Flow: [number], Conciseness: [number], Clarity: [number], On Topic: [number]"}
        ]
    )
    
    response_text = response.choices[0].message.content.strip()
    
    # Extract the numbers from the response
    grades = {}
    for line in response_text.split('\n'):
        if ':' in line:
            print(line)
            for small_part in line.split(","):
                smaller_part = small_part.split(":")
                grades[smaller_part[0]] = int(smaller_part[1])
    
    return grades


@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    user_id = data.get('user_id')
    thread_id = data.get('thread_id')
    content = data.get('content')
    print("I am at least here 2")
    if not user_id or not thread_id or not content:
        return jsonify({"error": "Missing required parameters"}), 400

    # Generate a new message_id
    message_id = db_functions.generate_new_message_id()
    if message_id is None:
        return jsonify({"error": "Failed to generate message_id"}), 500

    # Call the send_message function
    try:
        db_functions.send_message(message_id, user_id, thread_id, content)
        return jsonify({"status": "success", "message_id": message_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------- SignUp / Login Functions ---------------

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    randomStringId = username + "lovestext"
    return jsonify(db_functions.create_user(randomStringId, username, email, password))

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    return jsonify(db_functions.login_user(username, password))

@app.route('/get_user_stats', methods=['POST'])
def get_user_stats():
    data = request.json
    user_id = data.get('user_id')
    return jsonify(db_functions.get_user_stats(user_id))

@app.route('/create_user_stats', methods=['POST'])
def handle_create_user_stats(user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins):
    try:
        db_functions.create_user_stats(user_id, games_played, time_played, games_won, games_lost, global_ranking, gems, coins)
        return jsonify({"message": "Created user stats successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/create_user_leaderboard', methods=['POST'])
def handle_create_user_leaderboard(user_id, elo):
    try:
        db_functions.create_user_leaderboard(user_id, elo)
        return jsonify({"message": "Created user stats successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_elo', methods=['POST'])
def handle_get_elo(user_id):
    try:
        db_functions.get_elok(user_id)
        return jsonify({"message": "Got elo successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_global_rank', methods=['POST'])
def handle_get_global_rank(user_id):
    try:
        db_functions.get_global_rank(user_id)
        return jsonify({"message": "Got global rank successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/insert_mission', methods=['POST'])
def handle_insert_mission():
    try:
        db_functions.insert_mission()
        return jsonify({"message": "Inserted mission successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/reset_daily_missions', methods=['POST'])
def handle_reset_daily_missions():
    try:
        db_functions.reset_daily_missions()
        return jsonify({"message": "Reseted daily missions successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/reset_user_daily_completion', methods=['POST'])
def handle_reset_user_daily_completion():
    try:
        db_functions.reset_user_daily_completion()
        return jsonify({"message": "Reseted user daily completion successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/create_thread', methods=['POST'])
def handle_create_thread(thread_id, thread_name):
    try:
        db_functions.create_thread(thread_id, thread_name)
        return jsonify({"message": "Created thread successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/send_message', methods=['POST'])
def handle_send_message(message_id, user_id, thread_id, content):
    try:
        db_functions.send_message(message_id, user_id, thread_id, content)
        return jsonify({"message": "Sent message successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/retrieve_messages', methods=['POST'])
def handle_retrieve_messages(thread_id):
    try:
        db_functions.retrieve_messages(thread_id)
        return jsonify({"message": "Retrieved messages successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/create_game', methods=['POST'])
def create_game():
    data = request.json
    match_id = data['match_id']
    player_list = data['player_list']
    game_info = GameInfo()
    game = game_info.create_game(match_id, player_list)
    return jsonify({'message': 'Game created', 'game': game})

@app.route('/api/update_score', methods=['POST'])
def update_score():
    data = request.json
    match_id = data['match_id']
    new_scores = data['new_scores']
    game_info = GameInfo()
    game_info.update_score(match_id, new_scores)
    return jsonify({'message': 'Score updated'})

@app.route('/api/get_leaderboard', methods=['POST'])
def get_leaderboard():
    data = request.json
    match_id = data.get('id')
    print("APWDKPAKDPAWOD")
    print(match_id)
    if not match_id:
        return jsonify({'error': 'match_id is required'}), 400

    try:
        game_info = GameInfo()
        res = game_info.get_leaderboard(match_id)
        print('Leaderboard data:', res)

        return jsonify(res)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/end_game', methods=['POST'])
def end_game():
    match_id = request.json['match_id']
    game_info = GameInfo()
    game_info.end_game(match_id)
    return jsonify({'message': 'Game ended'})

#game_leaderboard = {"room111":{"frank": 10, "bob": 20}} 

GameLeaderBoards = {}

class GameInfo:
    def get_leaderboard(self, match_id):
        player_list = db_functions.view_lobby(match_id)
        if match_id not in GameLeaderBoards:
            GameLeaderBoards[match_id] = {}
            for player in player_list:
                GameLeaderBoards[match_id][player] = 0
            return self._helper(GameLeaderBoards[match_id])
        else:
            return self._helper(GameLeaderBoards[match_id])
        
    def update_score(self,match_id, new_scores):
        players = db_functions.view_lobby(match_id)
        for player in players:
            GameLeaderBoards[match_id][player] = new_scores[player]

    def end_game(self, match_id):
        del GameLeaderBoards[match_id]
    
    def _helper(self, score_dictionary):
        res = []
        for player in score_dictionary:
            res.append([player, score_dictionary[player]])
        
        res.sort(key=lambda x: x[1], reverse=True)
        return res


if __name__ == '__main__':
   socketio.run(app, port=5000, debug=True)
    # g = GameInfo()
    # print(g.get_leaderboard('chinatown'))