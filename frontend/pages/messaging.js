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
  const [isLoading, setLoading] = useState(true);
  const [threadId, setThreadId] = useState(null);
  // for progress bar
  const [userScores, setUserScores] = useState(null);

  const getMessages = () => {
    return messages;
  };
  const router = useRouter();
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') {
      console.log('Input value is empty, returning');
      return;
    }
    const updatedMessages = [...messages, { text: inputValue, sender: "user" }];
    // Create a new array with the updated messages
    setMessages(updatedMessages => [...updatedMessages, { text: inputValue, sender: 'user' }]);
    
    
    // Clear the input field
    setInputValue('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/send_message', {
        user_id: userId,
        thread_id: 1020,
        content: inputValue
      });
      console.log(response);

      console.log('the message id is: ', response.data.message_id);
      console.log(userId);

      console.log(updatedMessages);

      const response2 = await axios.post('http://127.0.0.1:5000/ai_grade', {
        previous_conversation: updatedMessages,
        user_id: userId,
        game_id: 1,
        thread_id: 1020,
        message_id: response.data.message_id
      });
      console.log(response2);
      const response3 = await axios.post('http://127.0.0.1:5000/send_message', {
        user_id: "1",
        thread_id: 1020,
        content: JSON.stringify(response2.data)
      });
      setMessages(updatedMessages => [...updatedMessages, { text: JSON.stringify(response2.data), sender: 'AI' }]);



      console.log(updatedMessages);
      // Pass the updated messages to receiveMessage
      await receiveMessage(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  // // this is for the progress bar
  // const receive_user_scores = async (userId, matchId) => {
  //   try {
  //     const response = await axios.post('localhost:5000/api/send_user_score', { user_id: userId, match_id: matchId });
  //     // flow, conciseness, clarity, relevance
  //     return response.data;

  //   } catch (error) {
  //     console.error('Error receiving user score:', error);
  //   }

  // };


  // Function to handle receiving a message
  const receiveMessage = async (updatedMessages) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/ai_response', {
        previous_conversation: updatedMessages,  // Use the passed messages
        prompt: "any prompt is fine",
        thread_id: 1020
      });

      // Update the state with the new AI message
      setMessages(prevMessages => [...prevMessages, { text: response.data.content, sender: 'AI' }]);
    } catch (error) {
      console.error('Error receiving message:', error);
    }
  };

  const get_leaderboard = async (matchId) => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/get_scoreboard`, {
        id: matchId
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
    if (router.isReady) {
      const { mID } = router.query;
      console.log(mID);
      const uID = sessionStorage.getItem('user_id');
      
      setMatchId(mID || 'chinatown');
      setUserId(uID || '');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await get_leaderboard(matchId);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (matchId && userId) {
      fetchLeaderboard(); // Initial fetch
      const intervalId = setInterval(fetchLeaderboard, 1000); // Fetch every second

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [matchId, userId]);

  useEffect(() => {
    const sendUserScore = async () => {
      
      };


    if (matchId && userId) {
      const intervalId = setInterval(sendUserScore, 1000); // Send user score every 5 second

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [matchId, userId]);


// Ensure matchId, userId, and leaderboard are set before rendering the main content
if (!matchId || !userId) {
  return <div>`Loading`...</div>; // Render a loading indicator while waiting for matchId, userId, and leaderboard
}


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex w-full">
        {loadingLeaderboard ? (
          <p>Loading leaderboard...</p>
        ) : (
          <Scoreboard user_id={userId} leaderboard={leaderboard} userScores={userScores}/>
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
                  <li key={index} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.sender !== 'user' && (
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
                    
                      <p className='message-box' style={{backgroundColor: message.sender === 'user' ? '#D1F8FF' : '#F0F0F0'}}>{message.text}</p>
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