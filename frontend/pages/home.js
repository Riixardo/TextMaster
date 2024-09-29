import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import Image from 'next/image'; // assuming Next.js for image optimization
import ProgressBar from "@/components/progress_bar";
import axios from "axios";

const Home = () => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [username, setUsername] = useState(null);
    const [userStats, setUserStats] = useState([]);
    const [userElo, setUserElo] = useState(null);
    const headingRef = useRef(null);
    const [buttonWidth, setButtonWidth] = useState('auto');

    const getUserStats = async () => {
        const response = await axios.post("http://127.0.0.1:5000/get_user_stats", {user_id: sessionStorage.getItem("user_id")});
        console.log(response.data);
        setUserStats(response.data.stats);
        setUserElo(response.data.elo);
    }

    useEffect(() => {
        setUsername(sessionStorage.getItem("username"));
        getUserStats();
        
        if (headingRef.current) {
            setButtonWidth(headingRef.current.offsetWidth);
        }
    }, []);

    const handleButtonClick = (buttonIndex) => {
        setSelectedButton(buttonIndex);
    };

    return (
        <div className="min-h-screen w-screen flex" style={{ backgroundColor: 'var(--background)' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto" style={{ background: '#ffffff', maxHeight: '100vh' }}>
                
                {/* New Header Section */}
                <div className="w-full flex flex-col items-center mb-6" style={{ backgroundColor: '#f0f0f0', padding: '1rem', margin: '0' }}>
                    {username && <h2 className="font-bold text-2xl mb-2" style={{ color: 'black' }}>
                        {username} <span className="text-sm">Level 32</span>
                    </h2>}
                    <div className="flex space-x-8 mt-2" style={{ color: 'black' }}>
                        {userStats.length > 0 && <p>win rate: {userStats[3] != 0? userStats[1] / userStats[3] : 0}%</p>}
                        {userStats.length > 0 && <p>global position: #{userStats[5]}</p>}
                        {userStats.length > 0 && <p>games played: {userStats[1]}</p>}
                        {userStats.length > 0 && <p>total playtime: {userStats[2]} hours</p>}
                        {userStats.length == 0 && <p>Loading Stats...</p>}
                    </div>
                </div>

                {/* Rest of the Main Content */}
                <div className="p-6">
                    {/* Current Elo Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center mb-2">
                            <Image src="/user_profile_pic.png" alt="Elo Icon" width={80} height={80} />
                            <div className="ml-4">
                                <h3 className="text-lg font-bold text-blue-500">Current Elo: Gold</h3>
                                <div className="flex items-center space-x-4 mt-2">
                                    {userStats.length > 0 && <div className="bg-green-200 p-2 rounded-lg text-green-600 font-bold">Gems: {userStats[6]}</div>}
                                    {userStats.length > 0 && <div className="bg-yellow-200 p-2 rounded-lg text-yellow-600 font-bold">Coins: {userStats[7]}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-4 w-full max-w-md">
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-500 rounded" style={{ width: '80%' }}></div>
                            </div>
                            {userElo && <span className="block text-center text-gray-500 text-sm mt-1">Elo: {userElo}</span>}
                        </div>
                    </div>

                    {/* Daily Missions Section */}
                    <div className="mb-6">
                        <h4 className="font-bold mb-2" style={{ color: '#665FE2' }}>Daily Missions</h4>
                        <div className="bg-white border p-4 rounded-lg space-y-4">
                            {[
                                { mission: 'Play 4 games total', progress: '70%', reward: '+20 exp' },
                                { mission: 'Get 10 combos in a roll', progress: '60%', reward: '+20 exp' }
                            ].map((mission, index) => (
                                <div key={index} className="border-b pb-2 mb-2">
                                    <p className="font-medium" style={{ color: '#665FE2' }}>{mission.mission}</p>
                                    <div className="relative w-full h-2 bg-gray-200 rounded mt-1">
                                        <div className="h-2 bg-blue-500 rounded" style={{ width: mission.progress, backgroundColor:'#665FE2' }}></div>
                                    </div>
                                    <p className="text-xs text-right" style={{ color: '#665FE2' }}>{mission.reward}</p>
                                </div>
                            ))}
                            <p className="text-xs font-bold" style={{ color: '#665FE2' }}>Completed</p>
                        </div>
                    </div>

                    {/* Match History Section */}
                    <div className="bg-white border p-4 rounded-lg">
                        <h4 className="font-bold mb-4" style={{ color: '#665FE2' }}>Match History</h4>
                        <div className="space-y-2">
                            {Array(6).fill(0).map((_, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded border-b">
                                    <p className="font-medium w-1/3" style={{ color: '#665FE2' }}>Political Debate</p>
                                    <p className="text-center w-1/3" style={{ color: '#665FE2' }}>98.6%/8</p>
                                    <p className="text-right w-1/3" style={{ color: '#665FE2' }}>+15 elo</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;