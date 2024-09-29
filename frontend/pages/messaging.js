import Sidebar from '../components/side_bar';
import Scoreboard from '../components/scoreboard';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import robotIcon from '../public/Profile-Picture-AI 1.png';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [matchId, setMatchId] = useState(null); // Initialize match_id state
  const [leaderboard, setLeaderboard] = useState([]); // Initialize leaderboard state
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();



  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: 'You' }]);
    setInputValue('');
  };

  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'AI' }]);
  };

  const get_leaderboard = async (matchId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/get_leaderboard`, {
        id: matchId,
      });

      return response.data;
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
    const mID = sessionStorage.getItem('matchId');
    const uID = sessionStorage.getItem('user_id');
    
    setMatchId(mID || 'chinatown');
    setUserId(uID || '');
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (matchId && userId) {
        try {
          const data = await get_leaderboard(matchId);
          setLeaderboard(data);
          console.log('leaderboard:', data);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLeaderboard();
  }, [matchId, userId]);


// // Ensure matchId, userId, and leaderboard are set before rendering the main content
// if (!matchId || !userId || leaderboard.length === 0) {
//   return null; // Return null to render nothing while waiting for matchId, userId, and leaderboard
// }

// Ensure matchId, userId, and leaderboard are set before rendering the main content
if (!matchId || !userId || leaderboard.length === 0) {
  return <div>`Loading`...</div>; // Render a loading indicator while waiting for matchId, userId, and leaderboard
}


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex w-full">
        {loadingLeaderboard ? (
          <p>Loading leaderboard...</p>
        ) : (
          <Scoreboard user_id={userId} leaderboard={leaderboard} />
        )}
        <div className="flex-grow h-screen p-6 flex flex-col" style={{ background: '#ffffff' }}>
          <h2 className="text-blue-500 text-2xl font-bold mb-4">Textmaster Messaging</h2>

          {/* Messages Display */}
          <div className="flex-grow p-4 rounded-lg overflow-auto">
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
                    <p className="message-box" style={{ backgroundColor: message.sender === 'You' ? '#D1F8FF' : '#F0F0F0' }}>
                      {message.text}
                    </p>
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
              style={{ height: '30px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}