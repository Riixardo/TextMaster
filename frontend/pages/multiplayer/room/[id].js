import { useEffect, useState } from "react"
import { useRouter} from 'next/router';

// this is a room 
const Room = ({ players = [] }) => {

  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Dynamic ID: {id}</h1>
      {players.length > 0 && players.map((player) => (<div className="text-white">{player}</div>))}
    </div>
  );
};

export default Room;