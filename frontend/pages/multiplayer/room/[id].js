import { useEffect, useState } from "react"
import { useRouter} from 'next/router';

// this is a room 
const Room = ({ players = [], leaveRoom}) => {

  const router = useRouter();
  const { id } = router.query;

  // harcoded for now
  const username = "riixardo"
  const user_id = "richardlovesslaves"

  return (
    <div>
      <h1>Dynamic ID: {id}</h1>
      {players.length > 0 && players.map((player) => (<div className="text-white">{player}</div>))}
      <button onClick={() => {leaveRoom(id, username, user_id)}}>LEAVE ROOM</button>
    </div>
  );
};

export default Room;