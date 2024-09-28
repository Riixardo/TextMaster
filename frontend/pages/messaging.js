import Sidebar from '../components/side_bar';
import Scoreboard from '../components/scoreboard';
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 

// Import the icon for received messages
import robotIcon from '../public/Profile-Picture-AI 1.png'; // Update path if needed
// import sendIcon from '../public/send-icon.png'; // Make sure to import the send icon


export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    setMessages([...messages, { text: inputValue, sender: 'You' }]);
    setInputValue('');
  };

  const receiveMessage = (message) => {
    setMessages([...messages, { text: message, sender: 'Other' }]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Hello!',
        'How are you?',
        'What are you doing?',
        'Nice to meet you!',
        'Goodbye!'
      ];
      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      receiveMessage(randomMessage);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages]);

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
                      {/* <p style={{ margin: 0 }}>{message.text}</p> */}
                    {/* </div> */}
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
            {/* <button
            onClick={handleSendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
            style={{ height: '30px', width: '30px' }}
            >
              <Image
                src={sendIcon}
                alt="Send Icon"
                width={30}
                height={30}
              />
            </button> */}
            {/* <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}