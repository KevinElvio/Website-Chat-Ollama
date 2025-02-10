import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const userMessage = { sender: 'user', text: userInput };
    setMessages([...messages, userMessage]);
    setUserInput('');

    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama2:7b-chat-q4_0',
        prompt: userInput,
        format: 'json',
        stream: false,
      });

      const botMessage = { sender: 'bot', text: response.data.response || 'No response available.' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      const errorMessage = { sender: 'bot', text: 'Oops! Something went wrong. Try again later.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100 ">
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden max-w-lg">
        <div className="text-gray-700 p-4">
          <h2 className="text-center text-lg font-semibold">AI Interview Chatbot</h2>
        </div>
        <div className="h-[50vh] overflow-y-auto p-4 bg-gray-50 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-black rounded-br-none'
                    : 'bg-gray-300 text-black rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center border-t p-4">
          <input
            type="text"
            className="flex-1 border border-gray-300 text-black rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
