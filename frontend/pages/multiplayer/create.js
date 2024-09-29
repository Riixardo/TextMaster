import React from "react";

const Create = ({ createRoom }) => {

    // hard coded for now
    const username = "frankisdank";
    const user_id = "franklovesslaves";

    const game_mode = "timed 3";
    const difficulty = "novice";
    const max_players = 8;

    return (
        <div className="w-screen flex bg-red-300 h-[20%]" onClick={() => createRoom(username, user_id, game_mode, difficulty, max_players)}>
            Testing for now, just creates a game instance with max 8 players, timed, 5 minutes, press me
        </div>
    );
};

export default Create;