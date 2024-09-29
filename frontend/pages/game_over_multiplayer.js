import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import LeaderboardCard from "@/components/leaderboard_card";

const gameOverMultiplayer = () => {

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
        <div className="min-h-screen w-screen" style={{ display: 'flex', backgroundColor: '#FFFFFF' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />
            <div style={{ marginLeft: '20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap:'10px'}}>
                <h1 style= {{textAlign: "center"}} className="text-4xl mt-5">Game Over</h1>
                <div>
                    <div style={{backgroundColor: '#e0e0e0', padding:'30px', borderRadius: '20px', marginTop: '-25px', paddingRight:'200px'}}>
                        <h2 style={{color: '#665FE2', fontWeight: 900, paddingLeft:'10px'}}>Group Stats</h2> 
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
                <div> 
                    <div style={{backgroundColor: '#e0e0e0', padding:'30px', borderRadius: '20px', paddingRight:'160px', paddingBottom:'30px'}}>                        
                        <h2 style={{color: '#665FE2', fontWeight: 900, marginLeft:'15px'}}>Your Stats</h2>
                        <div style={{display: 'flex', flexDirection: 'row', paddingTop:'40px', gap:'100px'}}>
                            <img src="https://via.placeholder.com/40" alt="Profile Picture" style={{width:'120px', paddingLeft:'15px'}}/>
                            <div style={{display: 'flex', flexDirection: 'column', paddingTop:'6px', gap:'40px'}}>
                                <h3 style={{color: '#665FE2', marginLeft:'15px', fontWeight: 600}}>Avg Score: 50</h3>
                                <h3 style={{color: '#665FE2', marginLeft:'15px', fontWeight: 600}}>Game Mode: easy</h3> 
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', paddingTop:'6px', gap:'40px'}}>
                                <h3 style={{color: '#665FE2', marginLeft:'15px', fontWeight: 600}}>Hits: 5</h3>
                                <h3 style={{color: '#665FE2', marginLeft:'15px', fontWeight: 600}}>Combos: 10</h3> 
                            </div>
                            <h3 style={{color: '#665FE2', marginLeft:'15px', fontWeight: 600, paddingTop:'6px'}}>Elo: 500</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default gameOverMultiplayer;