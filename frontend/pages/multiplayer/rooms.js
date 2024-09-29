import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import RoomBlock from "../../components/room";
import axios from "axios";

const Rooms = ({ joinRoom }) => {

    const [lobbies, setLobbies] = useState([]);

    const getLobbies = async () => {
        const response = await axios.get("http://127.0.0.1:5000/api/get_lobbies");
        setLobbies(response.data.lobbies);
    }

    useEffect(() => {
        getLobbies();
    }, []);

    return (
        <div className="min-h-screen w-screen flex">
            <Sidebar></Sidebar>
            <div className="h-screen w-[80%] ml-auto bg-white flex flex-col">
                <div className="w-full h-auto">
                    <h1 className="w-full text-center">Join Rooms</h1>
                </div>
                <div className="w-full ml-auto bg-white grid grid-cols-4">
                    {lobbies && lobbies.length > 0 && lobbies.map((lobby) => (<RoomBlock text={lobby[5] + "'s Room\nPlayers " + lobby[2] + "/" + lobby[1] + "\n" + lobby[3] + "\n" + lobby[4]} id={lobby[0]} joinRoom={joinRoom}></RoomBlock>))}
                </div>
            </div>
        </div>
    );
};

export default Rooms;