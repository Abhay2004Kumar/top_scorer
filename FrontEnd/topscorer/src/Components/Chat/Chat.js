import React, { useState } from 'react';
import style from './Chat.module.css';
import { FaSmile, FaPaperclip, FaTimes } from 'react-icons/fa';

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Handle sending the message
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className={`${style.chatContainer} ${isOpen ? style.open : style.closed}`}>
      <div className={style.header}>
        <span className={style.title}>Chat</span>
        <button className={style.closeButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaSmile />}
        </button>
      </div>
      {isOpen && (
        <div className={style.body}>
          <div className={style.messages}>
            {/* Messages will go here */}
          </div>
          <div className={style.footer}>
            <button className={style.emojiButton}><FaSmile /></button>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className={style.sendButton} onClick={handleSend}>Send</button>
            <button className={style.attachmentButton}><FaPaperclip /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
