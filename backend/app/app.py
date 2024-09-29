from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins='*')  

rooms = {}

def hash_string(string):
    # Create a hash object using SHA-256
    hash_object = hashlib.sha256(string.encode())
    # Convert the hash to a hexadecimal string
    hash_hex = hash_object.hexdigest()
    return hash_hex

@socketio.on('create_room')
def handle_create_room(data):
    creator = data['creator']
    room = hash_string(creator)
    if room not in rooms:
        rooms[room] = [creator]
        join_room(room)
        print(request.sid)
        emit('room_created', {'message': f'Room {room} created for {creator}', 'room': room, 'creator': creator, 'players': rooms[room]}, room=request.sid)
    else:   
        emit('error', {'message': f'Error: Cannot create more than one room!'}, room=request.sid)

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    user = data['user']
    rooms[room].append(user)
    join_room(room)
    print(request.sid)
    emit('room_joined', {'message': f'User joined {room}', 'room': room, 'user': user, 'players': rooms[room]}, room=request.sid)
    emit('room_updated', {'message': f'User joined {room}', 'room': room, 'user': user, 'players': rooms[room]}, room=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    user = data['user']
    rooms[room].remove(user)
    leave_room(room)
    emit('room_update', {'message': f'User left {room}', 'room': room, 'user': user, 'players': rooms[room]}, room=room)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message='Hello from Flask!')

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
    players = data['players']
    new_scores = data['new_scores']
    game_info = GameInfo()
    game_info.update_score(match_id, players, new_scores)
    return jsonify({'message': 'Score updated'})

@app.route('/api/get_leaderboard', methods=['GET'])
def get_leaderboard():
    match_id = request.args.get('match_id')
    if match_id in GameLeaderBoards:
        return jsonify({'leaderboard': GameLeaderBoards[match_id]})
    else:
        return jsonify({'message': 'Match ID not found'}), 404

#game_leaderboard = {"room111":{"frank": 10, "bob": 20}} 

GameLeaderBoards = {}

class GameInfo:
    def create_game(self, match_id, player_list):
        if match_id not in GameLeaderBoards:
            GameLeaderBoards[match_id] = []
            for player in player_list:
                GameLeaderBoards[match_id][player] = 0
            return GameLeaderBoards[match_id]
        else:
            return GameLeaderBoards[match_id]

    # def find_game(self, match_id):
    #     return GameLeaderBoards[match_id]
        
    def update_score(self,match_id, players, new_scores):
        for scores in GameLeaderBoards[match_id]:
            scores[1] = new_scores[players.index(scores[0])]

    def end_game(self, match_id):
        del GameLeaderBoards[match_id]


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)