import { useEffect, useState } from "react"
import { useRouter} from 'next/router';

// this is a room 
const Room = ({ players = [], leaveRoom}) => {

  const router = useRouter();
  const { id } = router.query;

  // harcoded for now
  const username = sessionStorage.getItem("username");
  const user_id = sessionStorage.getItem("user_id");

  return (
    <div>
      <h1>Dynamic ID: {id}</h1>
      {players.length > 0 && players.map((player) => (<div className="text-white">{player}</div>))}
      <button onClick={() => {
        leaveRoom(id, username, user_id);
        router.push("/multiplayer/rooms");
        }}>LEAVE ROOM</button>
    </div>
  );
};

export default Room;