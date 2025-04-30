import React, { useState, useEffect, useRef } from 'react';
import { FaSmile, FaPaperclip, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import MyTimer from '../customAnimations/Timer';

const ChatComponent = ({ sportName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600); // 10 minutes timer

  // Check if user is logged in
  useEffect(() => {
    const acToken = localStorage.getItem('accessToken');
    if (acToken) {
      try {
        const payload = acToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        setCurrentUser(decodedPayload.username);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Prevent background scrolling when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Initialize socket connection to CHAT namespace
  useEffect(() => {
    if (!isLoggedIn) return;

    const Url = `${process.env.REACT_APP_BACKEND_URL}/chat`;
    const newSocket = io(Url);
    // console.log("Connected to : ", Url);
    // console.log('Connecting to chat namespace...');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // console.log('Connected to chat namespace');
    });

    newSocket.on('disconnect', () => {
      // console.log('Disconnected from chat namespace');
    });

    return () => {
      // console.log('Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [isLoggedIn]);

  // Join room and listen for messages
  useEffect(() => {
    if (!socket || !sportName || !isLoggedIn) return;
  
    // console.log(`Joining room: ${sportName}`);
    socket.emit('join_chat_room', { 
      username: currentUser,
      room: sportName 
    });
  
    const handleChatRoomInfo = ({ room, users, messages }) => {
      // console.log(`Received chat room info for ${room}`, messages);
      const formattedMessages = messages.map(msg => ({
        username: msg.username || 'Unknown',
        message: typeof msg.message === 'string' ? msg.message : JSON.stringify(msg.message),
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMessages); // <-- Set older messages here
    };
  
    const handleReceiveMessage = (data) => {
      // console.log('Received message:', data);
      if (data && data.message) {
        const formattedMessage = {
          username: data.username || 'Unknown',
          message: typeof data.message === 'string' ? data.message : JSON.stringify(data.message),
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, formattedMessage]);
      }
    };
  
    const handleUserJoined = (username) => {
      setMessages(prev => [...prev, { 
        username: 'System', 
        message: `${username} joined the chat`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };
  
    const handleUserLeft = (username) => {
      setMessages(prev => [...prev, { 
        username: 'System', 
        message: `${username} left the chat`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    };
  
    socket.on('chat_room_info', handleChatRoomInfo);
    socket.on('receive_chat_message', handleReceiveMessage);
    socket.on('user_joined_chat', handleUserJoined);
    socket.on('user_left_chat', handleUserLeft);
  
    return () => {
      socket.off('chat_room_info', handleChatRoomInfo);
      socket.off('receive_chat_message', handleReceiveMessage);
      socket.off('user_joined_chat', handleUserJoined);
      socket.off('user_left_chat', handleUserLeft);
    };
  }, [socket, sportName, isLoggedIn, currentUser]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (message.trim() && socket && isLoggedIn) {
      const newMessage = {
        username: currentUser,
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('send_chat_message', { 
        room: sportName, 
        message: newMessage
      });
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const addEmoji = (emojiData) => {
    setMessage(prev => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  // Detect if the message contains only emojis
  const isEmojiOnly = (text) => {
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)+$/u;
    return emojiRegex.test(text);
  };

  return (
    <>
    
    <div 
      className={`fixed right-4 bottom-4 flex flex-col ${isOpen ? 'w-80 h-[500px] sm:w-96' : 'w-12 h-12 sm:w-16 sm:h-16'} bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 z-50 border border-gray-200`}
      ref={chatContainerRef}
    >
      
      {/* Header */}
      <div className="bg-indigo-600 text-white p-2 sm:p-3 flex justify-between items-center">
        {isOpen ? (
          <>
            <h3 className="font-semibold text-sm sm:text-lg truncate">{sportName} Chat</h3>
            <p className=' text-sm '>Free Chat for :</p>
            {/* <MyTimer expiryTimestamp={time}/> */}
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Close chat"
            >
              <FaTimes className="text-white text-sm sm:text-base" />
            </button>
          </>
        ) : (
          <button 
            onClick={() => {
              setIsOpen(true);
            }}
            className="w-full h-full flex items-center justify-center hover:bg-indigo-700 transition-colors"
            aria-label="Open chat"
          >
            <IoChatboxEllipsesOutline className="text-white text-xl sm:text-2xl" />
          </button>
        )}
      </div>
      

      {/* Chat Body */}
      {isOpen && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-2 sm:p-4 overflow-y-auto bg-gray-50" style={{ overscrollBehavior: 'contain' }}>
            {!isLoggedIn ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-gray-600 mb-4">Please log in to participate in the chat</p>
                <button 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                    // You might want to redirect to login page or open a login modal
                    window.location.href = '/dashboard/login'; // Adjust this based on your routing
                  }}
                >
                  Log In
                </button>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-3 ${msg.username === 'System' ? 'text-center' : ''}`}
                  >
                    {msg.username !== 'System' ? (
                      <div className={`flex ${msg.username === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`relative ${
                            isEmojiOnly(msg.message) 
                              ? `text-4xl p-1 ${msg.username === currentUser ? 'bg-indigo-50' : 'bg-gray-100'} rounded-lg min-w-[60px] flex justify-center`
                              : `min-w-[120px] max-w-[80%] p-2 ${
                                  msg.username === currentUser 
                                    ? 'bg-indigo-100 text-indigo-900 rounded-l-lg rounded-tr-lg' 
                                    : 'bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg'
                                }`
                          }`}
                        >
                          {/* Username only shown for received messages */}
                          {msg.username !== currentUser && (
                            <span className="font-semibold text-xs text-indigo-600 block mb-1">
                              {msg.username}
                            </span>
                          )}
                          
                          {/* Message text */}
                          <div className={isEmojiOnly(msg.message) ? '' : 'pb-3'}>
                            {msg.message}
                          </div>
                          
                          {/* Timestamp - shown differently for emoji vs text messages */}
                          {!isEmojiOnly(msg.message) ? (
                            <div className={`absolute bottom-1 right-2 flex items-center space-x-1 ${
                              msg.username === currentUser ? 'text-indigo-700' : 'text-gray-500'
                            }`}>
                              <span className="text-[10px]">
                                {msg.timestamp}
                              </span>
                            </div>
                          ) : (
                            <div className={`text-[10px] ${
                              msg.username === currentUser ? 'text-indigo-700' : 'text-gray-500'
                            } text-center mt-1`}>
                              {msg.timestamp}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 py-1">
                        {msg.message}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4 z-10" ref={inputRef}>
              <EmojiPicker 
                onEmojiClick={addEmoji}
                width={280}
                height={350}
                emojiStyle="native"
                previewConfig={{ showPreview: false }}
                searchDisabled
                skinTonesDisabled
              />
            </div>
          )}

          {/* Input Area - Only show if logged in */}
          {isLoggedIn && (
            <div className="p-2 sm:p-3 border-t border-gray-200 bg-white relative bottom-0">
              <div className="flex items-center">
                <button 
                  className="p-1 sm:p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  aria-label="Emoji picker"
                >
                  <FaSmile className="text-lg sm:text-base" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 mx-1 sm:mx-2 py-1 sm:py-2 px-2 sm:px-4 border text-gray-800 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  ref={inputRef}
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`p-2 sm:p-3 rounded-full transition-colors ${message.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  aria-label="Send message"
                >
                  <FaPaperPlane className="text-lg sm:text-base" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ChatComponent;