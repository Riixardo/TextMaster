import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const router = useRouter();

    const handleClick = (index, path) => {
        setActiveIndex(index);
        router.push(path);
    };

    const menuItems = [
        { name: 'Home', path: '/home' },
        { name: 'Multiplayer', path: '/multiplayer/room' },
        { name: 'Singleplayer', path: '/singleplayer' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Shop', path: '/shop' },
    ];

    return (
        <div className="sidebar">
            <h2 className=" text-3xl font-extrabold p-4" style={{ color: '#4F46E5' }}>Textmaster</h2>
            <nav className="mt-8">
                <ul className='purple-colored-text'>
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`p-4 font-extrabold`}
                            style={{
                                backgroundColor: activeIndex === index ? '#4F46E5' : 'transparent',
                                color: activeIndex === index ? 'white' : '#4F46E5',
                            }}
                            onClick={() => handleClick(index, item.path)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;