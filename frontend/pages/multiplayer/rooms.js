import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "../components/side_bar";
import RoomBlock from "../components/room";

const Rooms = ({ joinRoom }) => {

    useEffect(() => {

    }, []);

    return (
        <div className="min-h-screen w-screen flex">
            <Sidebar></Sidebar>
            <div className="h-screen w-[80%] ml-auto bg-white flex flex-col">
                <div className="w-full h-auto">
                    <h1 className="w-full text-center">Join Rooms</h1>
                </div>
                <div className="w-full ml-auto bg-white grid grid-cols-4">
                    <RoomBlock text="Frankisdank's room" id="0302fef5975541f25b95b7b1edb1d8346965e130ca7e35c3253f019663b73cbe" joinRoom={joinRoom}></RoomBlock>
                    <RoomBlock text="Frankisdank's room" id="2"></RoomBlock>
                    <RoomBlock text="Frankisdank's room" id="3"></RoomBlock>
                    <RoomBlock text="Frankisdank's room" id="4"></RoomBlock>
                    <RoomBlock text="Frankisdank's room" id="5"></RoomBlock>
                    
                </div>
            </div>
        </div>
    );
};

export default Rooms;