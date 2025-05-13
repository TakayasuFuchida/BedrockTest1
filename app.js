import React, { useState, useEffect } from 'react';
import Amplify, { Hub, API } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const listener = Hub.listen('bedrock', async (data) => {
      const message = data.payload.data.message;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => listener();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() !== '') {
      try {
        await API.post('bedrock', '/chat', {
          body: { message: inputText },
        });
        setInputText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <h1>Chat with Bedrock</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
