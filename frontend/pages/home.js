import { useState, useEffect, useRef } from "react";
import React from "react";

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
        <div className="min-h-screen w-screen" style={{backgroundColor: 'var(--background)', fontFamily: 'Nunito, sans-serif'}}>
            <h1 ref={headingRef} style={{ position: 'absolute', top: '0', left: '10px', margin: '30px', color: 'var(--textmaster-purple)', fontSize: '48px', fontWeight: '700' }}>textmaster</h1>

            <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: '10px', top: '100px', fontWeight: '700' }}>
                {['Home', 'Multiplayer', 'Singleplayer', 'Leaderboard', 'Shop'].map((buttonText, index) => (
                    <button
                        key={index}
                        className={`home-button ${selectedButton === index ? 'selected' : ''}`}
                        onClick={() => handleButtonClick(index)}
                        style={{ width: buttonWidth }}
                    >
                        {buttonText}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;