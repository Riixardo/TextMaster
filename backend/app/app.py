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

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)