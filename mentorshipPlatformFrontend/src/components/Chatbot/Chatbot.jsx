import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const formatMessage = (text) => {
    // Handle bold text
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>');
    
    // Handle line breaks
    formattedText = formattedText.replace(/\\n/g, '<br/>');
    formattedText = formattedText.replace(/\n/g, '<br/>');
    
    // Handle links - make them blue
    formattedText = formattedText.replace(
      /\[(.*?)\]\((https?:\/\/[^\s]+)\)/g, 
      '<a href="$2" class="text-blue-400 underline" target="_blank">$1</a>'
    );
    
    // Handle regular URLs
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" class="text-blue-400 underline" target="_blank">$1</a>'
    );
    
    // Handle headings (## Heading)
    formattedText = formattedText.replace(
      /^## (.*?)$/gm, 
      '<h2 class="text-lg font-bold mt-2 mb-1">$1</h2>'
    );
    
    return formattedText;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8085/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      const botReply = { from: 'bot', text: data.response || '🤖 No response.' };
      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { from: 'bot', text: '⚠️ Server error. Please try later.' }]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="font-sans">
      {/* Floating Chat Icon with pulse animation */}
      <div 
        className={`fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-16 h-16 flex justify-center items-center 
        cursor-pointer shadow-lg z-50 hover:bg-blue-700 transition-all duration-300 animate-pulse
        ${isOpen ? 'rotate-90' : 'hover:scale-110'}`}
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </div>

      {/* Chat Window with slide-in animation */}
      <div 
        className={`fixed bottom-24 right-5 w-80 lg:w-96 bg-gray-900 border border-gray-700 rounded-lg 
        shadow-2xl flex flex-col z-40 transition-all duration-500 transform
        ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{height: '450px'}}
      >
        {/* Header */}
        <div className="bg-gray-800 text-white p-3 font-bold flex justify-between items-center rounded-t-lg border-b border-gray-700">
          <div className="flex items-center">
            <MessageCircle size={18} className="mr-2 text-blue-400" />
            <span>ChatBot</span>
          </div>
          <button 
            onClick={toggleChat} 
            className="bg-transparent border-none text-gray-400 hover:text-white text-xl cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-3 bg-gray-950 space-y-3 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[85%] shadow-md animate-fadeIn
                ${msg.from === 'user' 
                  ? 'ml-auto bg-blue-600 text-white rounded-br-none' 
                  : 'mr-auto bg-gray-800 text-gray-100 rounded-bl-none'}`}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                className="message-content whitespace-pre-wrap"
              />
            </div>
          ))}
          {loading && (
            <div className="mr-auto p-3 bg-gray-800 text-gray-100 rounded-lg rounded-bl-none max-w-[85%] shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-lg">
          <div className="flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow p-2 rounded-l-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-900 text-white"
            />
            <button 
              onClick={sendMessage} 
              className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;