import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import RoomBlock from "../../components/room";

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
                    <RoomBlock text="Frankisdank's room" id="cb751553102143a57337435e9540174863efabe3931a114fab4a64ba4fd6bc29" joinRoom={joinRoom}></RoomBlock>
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