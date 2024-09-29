import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";
import Image from 'next/image'; // assuming Next.js for image optimization
import ProgressBar from "@/components/progress_bar";

const Home = () => {
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

    return (
        <div className="min-h-screen w-screen flex" style={{ backgroundColor: 'var(--background)' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto" style={{ background: '#ffffff', maxHeight: '100vh' }}>
                
                {/* New Header Section */}
                <div className="w-full flex flex-col items-center mb-6" style={{ backgroundColor: '#f0f0f0', padding: '1rem', margin: '0' }}>
                    <h2 className="font-bold text-2xl mb-2" style={{ color: 'black' }}>
                        {sessionStorage.getItem("username")} <span className="text-sm">Level 32</span>
                    </h2>
                    <div className="flex space-x-8 mt-2" style={{ color: 'black' }}>
                        <p>win rate: 56%</p>
                        <p>global position: #1032</p>
                        <p>games played: 55</p>
                        <p>total playtime: 10.5 hours</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="bg-green-200 p-2 rounded-lg text-green-600 font-bold">1001</div>
                        <div className="bg-yellow-200 p-2 rounded-lg text-yellow-600 font-bold">1001</div>
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
                                    <div className="bg-green-200 p-2 rounded-lg text-green-600 font-bold">1001</div>
                                    <div className="bg-yellow-200 p-2 rounded-lg text-yellow-600 font-bold">1001</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-4 w-full max-w-md">
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-500 rounded" style={{ width: '80%' }}></div>
                            </div>
                            <span className="block text-center text-gray-500 text-sm mt-1">2500/3000</span>
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