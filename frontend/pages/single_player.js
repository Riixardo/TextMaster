import Sidebar from '../components/side_bar';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import robotIcon from '../public/Profile-Picture-AI 1.png';
import { useRouter } from 'next/router';
import axios from 'axios';


export default function Messaging() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [inputValue, setInputValue] = useState('');
  // for progress bar
  const [userScores, setUserScores] = useState(null);
  const [thread_id, setThreadId] = useState(null);

  useEffect(() => {
    if (router.query.thread_id) {
      setThreadId(router.query.thread_id);
    }

    // get the user id from the session storage
    const uID = sessionStorage.getItem('user_id');
    setUserId(uID || '');
  }, [router.query.thread_id]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') {
      console.log('Input value is empty, returning');
      return;
    }

    // Add the user's message to the state
    const updatedMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(updatedMessages);

    // Clear the input field
    setInputValue('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/send_message', {
        user_id: userId,
        thread_id: thread_id,
        content: inputValue
      });

      console.log('the message id is: ', response.message_id);

      // Pass the updated messages to receiveMessage
      await receiveMessage(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Function to handle receiving a message
  const receiveMessage = async (updatedMessages) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/ai_response', {
        previous_conversation: updatedMessages,
        prompt: 'any prompt is fine',
        thread_id: thread_id
      });

      // Update the state with the new AI message
      setMessages((prevMessages) => [...prevMessages, { text: response.data.content, sender: 'AI' }]);
    } catch (error) {
      console.error('Error receiving message:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Only render the component when `userId` and `thread_id` are available
  if (!userId || !thread_id) {
    return null; // Render nothing until `userId` and `thread_id` are available
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex w-full">
        {/* <Scoreboard user_id={userId} leaderboard={[]} userScores={userScores} /> */}
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
                    <p
                      className="message-box"
                      style={{ backgroundColor: message.sender === 'user' ? '#D1F8FF' : '#F0F0F0' }}
                    >
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