import React from "react";
import { useState } from "react";


export default function Sidebar() {
      const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (index) => {
        setActiveIndex(index);
    };
    return (
        <div className="sidebar">
            <h2 className=" text-3xl font-extrabold p-4" style={{ color: '#4F46E5' }}>Textmaster</h2>
            <nav className="mt-8">
                <ul class='purple-colored-text'>
                     {['Home', 'Multiplayer', 'Singleplayer', 'Leaderboard', 'Shop'].map((item, index) => (
                        <li
                            key={index}
                            className={`p-4 font-extrabold`}
                            style={{
                                backgroundColor: activeIndex === index ? '#4F46E5' : 'transparent',
                                color: activeIndex === index ? 'white' : '#4F46E5',
                            }}
                            onClick={() => handleClick(index)}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
