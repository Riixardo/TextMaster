import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";

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
        <div className="min-h-screen w-screen" style={{backgroundColor: 'var(--background)' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />
        </div>
    );
};

export default Home;