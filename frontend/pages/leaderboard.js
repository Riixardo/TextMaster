import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import LeaderboardCard from "@/components/leaderboard_card";

const Leaderboard = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const headingRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState('auto');

    useEffect(() => {
        if (headingRef.current) {
            setButtonWidth(headingRef.current.offsetWidth);
        }
    }, []);

    const handleButtonClick = (buttonIndex) => {
        setSelectedButton(buttonIndex);
    };

    const leaderboardData = [
        { placing: 1, username: "User1", points: 1500, profilePic: "https://via.placeholder.com/40" },
        { placing: 2, username: "User2", points: 1400, profilePic: "https://via.placeholder.com/40" },
        { placing: 3, username: "User3", points: 1300, profilePic: "https://via.placeholder.com/40" },
    ];

    return (
        <div className="min-h-screen w-screen" style={{ display: 'flex' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />

            <div style={{ marginLeft: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="text-4xl mt-5">Leaderboard</h1>
                {leaderboardData.map((data, index) => (
                    <LeaderboardCard
                        key={index}
                        placing={data.placing}
                        username={data.username}
                        points={data.points}
                        profilePic={data.profilePic}
                    />
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;