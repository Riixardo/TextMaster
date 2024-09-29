from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, emit, leave_room
from flask_cors import CORS
import hashlib
import db_functions
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import os
from dotenv import load_dotenv

from app.openai_api import generate_prompt

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins='*')  

load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

rooms = {}

difficulty = {
    "Hard": "The topic should be serious, semi formal, a little longer than the avgerage text message. Topic should not need any extensive previous background.",
    "Medium": "Topic that are a little more personal, opinionated, and a little less casual in topic. Also, use topics that do not require long responses.Topic should not need any extensive previous background.",
    "Easy": "topics that only really need one sentence per response from the user, extremely casual in topic and tone. Topic needs to be not serious. Topic should not need any extensive previous background."
}

def hash_string(string):
    # Create a hash object using SHA-256
    hash_object = hashlib.sha256(string.encode())
    # Convert the hash to a hexadecimal string
    hash_hex = hash_object.hexdigest()
    return hash_hex

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
    db_functions.join_lobby(room, data['user_id'])
    players = db_functions.view_lobby(room)
    join_room(room)
    print(f'User {user} joined room {room}.')
    emit('room_joined', {'message': f'User joined {room}', 'room': room, 'user': user, 'players': players}, room=request.sid)
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

@app.route('/generate_prompt', methods=['POST'])
def handle_generate_prompt():
    generated_prompt = generate_prompt()
    return jsonify({'generated_text': generated_prompt}), 200

@app.route('/generate_prompt', methods=['POST'])
def ai_response_prompt(previous_conversation, prompt):
    generated_prompt = ai_response_prompt(previous_conversation, prompt)
    return jsonify({'ai_response_text': generated_prompt}), 200


# @app.route('/api/hello', methods=['GET'])
# def hello():
#     return jsonify(message='Hello from Flask!')


# def generate_prompt():
#     response = client.chat.completions.create(model="gpt-4",
#     messages=[
#         {"role": "system", "content": "You are an useful program that will do anything to help the user, making sure you satisfy the user to the best of your abilities"},
#         {"role": "user", "content": "Generate me a prompt that is 2-3 sentences long, that are designed to be graded for english texting fluency, make sure the prompt is engaging and interesting. and most importantly will show up regularlly in everyday online conversations"}
#     ])
#     return response.choices[0].message.content.strip()

def generate_prompt(prompt_diffculty):
    response = client.chat.completions.create(model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an useful program that will do anything to help the user, making sure you satisfy the user to the best of your abilities"},
        {"role": "user", "content": f"Generate me an conversation topic is likely to show up in people's lives. that is 2 sentences long, that are designed to be graded for english texting fluency, make sure the conversation is engaging and interesting. make it sound as human as possible. {difficulty[prompt_diffculty]}"}
    ])
    return response.choices[0].message.content.strip()

# TODO: check if there could be too many words, might cause crash
def ai_response_prompt(previous_conversation, prompt):
    prev_convo = ""
    is_AI = True
    for convo in previous_conversation:
        if is_AI:
            prev_convo += "you said: "
        else:
            prev_convo += "the other person said: "
        is_AI = not is_AI
        prev_convo += convo + "\n"
    response = client.chat.completions.create(model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an competent but easy conversation program, you should behave like one, that is trying to have a normal conversation with the user, make sure you best mimic how a normal human would engage in the conversation."},
            {"role": "user", "content": f"The starting conversation topic is {prompt}. Here's the previous conversation that has been talked about so far: {prev_convo}. Generate me the a starting piece to this prompt like an online text conversation, try to come up with personalized example based on the prompt, include that in the first reponse, keep the responses between 1 to 2 sentences, only include what you say to the person in the response."}
    ])
    return response.choices[0].message.content.strip()


def grade_user_responses(previous_conversation, prompt):
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

if __name__ == '__main__':
   socketio.run(app, port=5000, debug=True)
