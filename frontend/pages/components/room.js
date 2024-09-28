import { useEffect } from "react";
import { useRouter } from 'next/router';
import { io } from "socket.io-client";

const RoomBlock = ({text, id, joinRoom}) => {

    // harcoded for now
    const username = "RichardChen"

    return (
        <div className="ml-8 rounded-xl bg-gray-200 p-4 w-[80%] mb-8 text-black text-center h-[15vh] hover:bg-[#333333]" onClick={() => joinRoom(id, username)}>{text}</div>
    )
}

export default RoomBlock;