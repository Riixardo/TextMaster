import React from "react";

const Create = ({ createRoom }) => {

    // hard coded for now
    const username = "Frankisdank";

    return (
        <div className="w-screen flex bg-red-300 h-[20%]" onClick={() => createRoom(username)}>
            Testing for now, just creates a game instance with max 8 players, timed, 5 minutes, press me
        </div>
    );
};

export default Create;