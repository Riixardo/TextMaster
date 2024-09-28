from flask import Flask, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_cors import CORS
import hashlib
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
import os
from dotenv import load_dotenv

from app.openai_api import generate_prompt

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins='*')  

load_dotenv()

rooms = {}

# Set your OpenAI API key

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

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)