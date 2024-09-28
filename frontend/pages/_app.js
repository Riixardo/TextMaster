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
      setPlayers(data['players'])
      router.push(`/multiplayer/room/${data['room']}`);
    });

    socket.on('room_updated', (data) => {
      console.log(data);
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

  const createRoom = async (creator) => {
    socketInstance.emit('create_room', { creator });
  };

  const joinRoom = async (room, user) => {
    socketInstance.emit('join_room', { room, user });
  };

  const leaveRoom = async (room, user) => {
    socketInstance.emit('leave_room', { room, user });
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
