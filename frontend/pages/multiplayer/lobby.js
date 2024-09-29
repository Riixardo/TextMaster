import React from "react";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/side_bar";
import profileCard from "@/components/profile_card";

const lobby = () => {

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
    
    const profileData = [
        { username: "User1", profilePic: "https://via.placeholder.com/40" },
        { username: "User2", profilePic: "https://via.placeholder.com/40" },
        { username: "User3", profilePic: "https://via.placeholder.com/40" },
        { username: "User4", profilePic: "https://via.placeholder.com/40" }
    ];


    return (
        <div className="min-h-screen w-screen" style={{ display: 'flex' }}>
            <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />
            <div style={{backgroundColor: '#FFFFFF', flex:1, padding: '33px', textAlign:'center'}}>
                <h1 className="text-4xl mt-5" style = {{color: '#4a4aff'}}>Multiplayer Room</h1>
                <div style={{overflowY: 'scroll', height:"400px"}}>
                    <div style={{display: 'flex', flexDirection: 'row', paddingTop:'40px', gap:'100px'}}>
                        <div style={{paddingRight:'20px'}}>
                            {profileData.map((data, index) => (
                            <profileCard
                                key={index}
                                username={data.username}
                                profilePic={data.profilePic}
                            />
                            ))} 
                        </div>
                        <div>
                            {profileData.map((data, index) => (
                            <profileCard
                                key={index}
                                username={data.username}
                                profilePic={data.profilePic}
                            />
                            ))} 
                        </div>
                    </div>    
                </div>     
            </div>    
        </div>
    );
}
export default lobby;