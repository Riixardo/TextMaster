from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, emit, leave_room
from flask_cors import CORS
import hashlib
import db_functions

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

@app.route('/api/get/room', methods=['GET'])
def hello():
    return jsonify(message='Hello from Flask!')

if __name__ == '__main__':
   socketio.run(app, port=5000, debug=True)
