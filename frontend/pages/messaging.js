import Sidebar from '../components/side_bar';
import Scoreboard from '../components/scoreboard';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import robotIcon from '../public/Profile-Picture-AI 1.png';
import { useRouter } from 'next/router';
import axios from 'axios';


export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matchId, setMatchId] = useState(null); // Initialize match_id state
  const [leaderboard, setLeaderboard] = useState([]); // Initialize leaderboard state

  const router = useRouter();

  const handleSendMessage = async (e) => {
    if (inputValue.trim() === '') return;
    setMessages([...messages, { text: inputValue, sender: 'You' }]);
    setInputValue('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/send_message', {
        user_id: "test_user",
        thread_id: 1020,
        content: inputValue
      });
      console.log(response);
      console.log(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const receiveMessage = (message) => {
    setMessages([...messages, { text: message, sender: 'AI' }]);
  };

  const get_leaderboard = async (matchId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get_leaderboard?matchId=${matchId}`);
      const data = await response.json();
      setLeaderboard(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

    useEffect(() => {
    if (router.query.matchId) {
      setMatchId(router.query.matchId);
      get_leaderboard();
    }
  }, [router.query.matchId]);


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomMessages = [
  //       'Hello!',
  //       'How are you?',
  //       'What are you doing?',
  //       'Nice to meet you!',
  //       'Goodbye!'
  //     ];
  //     const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  //     receiveMessage(randomMessage);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [messages]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex w-full">
        <Scoreboard />
        <div className="flex-grow h-screen p-6 flex flex-col" style={{ background: '#ffffff' }}>
          <h2 className="text-blue-500 text-2xl font-bold mb-4">Textmaster Messaging</h2>

          {/* Messages Display */}
          <div className="flex-grow p-4 rounded-lg overflow-auto" >
            {messages.length === 0 ? (
              <p style={{ color: 'black' }}>No messages yet.</p>
            ) : (
              <ul>
                {messages.map((message, index) => (
                  <li key={index} className={`mb-2 flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender !== 'You' && (
                      <div className="flex items-end">
                        <Image
                          src={robotIcon}
                          alt="Robot Icon"
                          width={30}
                          height={30}
                          className="mr-2 w-8 h-8"
                        />
                      </div>
                    )}
                    
                      <p className='message-box' style={{backgroundColor: message.sender === 'You' ? '#D1F8FF' : '#F0F0F0'}}>{message.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Input Area */}
          <div className="flex mt-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown} 
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ height: '30px'}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}