import { useState, useEffect, useRef } from "react";
import React from "react";
import Sidebar from "@/components/side_bar";

const Create = ({ createRoom }) => {

    // hard coded for now
    const username = sessionStorage.getItem("username");
    const user_id = sessionStorage.getItem("user_id");

    const [difficulty, setDifficulty] = useState("novice");
    const [time, setTime] = useState(1);
    const [maxPlayers, setMaxPlayers] = useState(8);
    const [visibility, setVisibility] = useState('private');
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
        <div className="min-h-screen w-screen" style={{ display: 'flex' }}>
        <Sidebar selectedButton={selectedButton} handleButtonClick={handleButtonClick} buttonWidth={buttonWidth} />
        <div style={{backgroundColor: '#FFFFFF', flex:1, padding: '33px', textAlign:'center'}}>
            <h1 className="text-4xl mt-5" style = {{color: '#4a4aff'}}>Game Settings</h1>
            
            <div style = {{backgroundColor: '#e0e0e0', padding: '25px', borderRadius: '10px', marginBottom: '20px'}}>
                <div style={{textAlign: 'left', marginLeft: '100px', paddingBottom: '7.5px'}}>
                    <h2 style={{color: '#000000', fontWeight: 900}}>Difficulty: </h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', marginLeft: '100px', gap: '265px'}}>
                    <label>
                        <input type = "radio" value= "novice" checked ={difficulty === 'novice'} onChange={() => setDifficulty('novice')} />
                        Novice
                    </label>
                    <label>
                        <input type = "radio" value= "seasoned" checked ={difficulty === 'seasoned'} onChange={() => setDifficulty('seasoned')} />
                        Seasoned
                    </label>
                    <label>
                        <input type = "radio" value= "master" checked ={difficulty === 'master'} onChange={() => setDifficulty('master')} />
                        Master
                    </label>  
                </div>    
            </div>

            <div style = {{backgroundColor: '#b0b0ff', padding: '25px', borderRadius: '10px', marginBottom: '20px'}}>
                <div style={{textAlign: 'left', marginLeft: '100px', paddingBottom: '7.5px'}}>
                    <h2 style={{color: '#000000', fontWeight: 900}}>Time: </h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', marginLeft: '90px', gap: '240px' }}>
                    <label>
                        <input type = "radio" value= "1" checked ={time === 1} onChange={() => setTime(1)} />
                        1 minute 
                    </label>
                    <label>
                        <input type = "radio" value= "3" checked ={time === 3} onChange={() => setTime(3)} />
                        3 minutes 
                    </label>
                    <label>
                        <input type = "radio" value= "5" checked ={time === 5} onChange={() => setTime(5)} />
                        5 minutes 
                    </label>  
                </div>    
            </div>

            <div style = {{backgroundColor: '#e0e0e0', padding: '25px', borderRadius: '10px', marginBottom: '20px'}}>
                <div style={{textAlign: 'left', marginLeft: '100px', paddingBottom: '7.5px'}}>
                    <h2 style={{color: '#000000', fontWeight: 900}}>Visibility: </h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', marginLeft: '100px', gap: '260px' }}>
                    <label>
                        <input type = "radio" value= "2" checked ={maxPlayers === "2"} onChange={() => setMaxPlayers('2')} />
                        2
                    </label>
                    <label>
                        <input type = "radio" value= "3" checked ={maxPlayers === "3"} onChange={() => setMaxPlayers('3')} />
                        3
                    </label>
                    <label>
                        <input type = "radio" value= "2" checked ={maxPlayers === "2"} onChange={() => setMaxPlayers('2')} />
                        2
                    </label>
                    <label>
                        <input type = "radio" value= "3" checked ={maxPlayers === "3"} onChange={() => setMaxPlayers('3')} />
                        3
                    </label>
                </div>    
            </div>

            <div style = {{backgroundColor: '#e0e0e0', padding: '25px', borderRadius: '10px', marginBottom: '20px'}}>
                <div style={{textAlign: 'left', marginLeft: '100px', paddingBottom: '7.5px'}}>
                    <h2 style={{color: '#000000', fontWeight: 900}}>Visibility: </h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', marginLeft: '100px', gap: '260px' }}>
                    <label>
                        <input type = "radio" value= "public" checked ={visibility === 'public'} onChange={() => setVisibility('public')} />
                        Public 
                    </label>
                    <label>
                        <input type = "radio" value= "private" checked ={visibility === 'private'} onChange={() => setVisibility('private')} />
                        Private 
                    </label>
                </div>    
            </div>
            <div style={{textAlign:'right', width:'1000px'}}>
                <button onClick={() => createRoom(username, user_id, "timed " + time, difficulty, maxPlayers)}> start game </button>
            </div>
        </div>
    </div>
    );
};

export default Create;