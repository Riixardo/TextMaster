import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {

  const router = useRouter();
  
  const [socketInstance, setSocketInstance] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000"); 

    socket.on('connect', () => {
      console.log('Connected to Socket.IO');
      setSocketInstance(socket);
    });

    socket.on('room_created', (data) => {
      console.log(data);
      setPlayers(data['players'])
      console.log(data['players']);
      router.push(`/multiplayer/room/${data['room']}`);
    });

    socket.on('room_joined', (data) => {
      console.log(data);
      if (data['status'] == -1) {
        alert("ROOM IS FULL");
        return;
      }
      setPlayers(data['players'])
      router.push(`/multiplayer/room/${data['room']}`);
    });

    socket.on('room_updated', (data) => {
      console.log("FUCKING UPDATEFD");
      setPlayers(data['players'])
    });

    socket.on('error', (data) => {
      console.log(data);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  const createRoom = async (creator, creator_id, game_mode, difficulty, max_players) => {
    socketInstance.emit('create_room', { creator, creator_id, game_mode, difficulty, max_players });
    console.log("WDPWOAKDAWPDWDDW");
  };

  const joinRoom = async (room, user, user_id) => {
    socketInstance.emit('join_room', { room, user, user_id });
  };

  const leaveRoom = async (room, user, user_id) => {
    console.log("LEVEE");
    socketInstance.emit('leave_room', { room, user, user_id });
  };

  return (
    <Component
      {...pageProps}
      socket={socketInstance}
      createRoom={createRoom}
      joinRoom={joinRoom}
      leaveRoom={leaveRoom}
      players={players}
    />
  );
}
