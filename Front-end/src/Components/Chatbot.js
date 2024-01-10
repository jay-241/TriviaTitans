import React, { useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import { Fab, IconButton } from '@mui/material';
import Message from './Message';
import { SendRounded, Chat, CloseRounded } from '@mui/icons-material';

export default function ChatBot() {
    const [open, setOpen] = React.useState(false);
    const [isLocked] = React.useState(false);
    const [messages, setMessages] = React.useState([]);
    const inputRef = useRef(null);

    const sendMessage = async (message, userId = 'DefaultUser') => {
        const response = await axios.post('https://d6x5p3bllk.execute-api.us-east-1.amazonaws.com/prod/chatbotcall', {
            message,
            userId,
        });

        // Updating the messages with bot response
        setMessages(prev => [...prev, { message: response.data, username: 'Bot', timestamp: new Date().toISOString(), incoming: true }]);
    }

    const handleSend = async () => {
        const message = inputRef.current.value;
        if (message.trim() !== '') {
            // Updating the messages with user input
            setMessages(prev => [...prev, { message, username: 'User', timestamp: new Date().toISOString(), incoming: false }]);
            await sendMessage(message);
            inputRef.current.value = '';
        }
    }

    return (
        <div id='chatbot' className='chatbot'>
            {
                open ?
                    (
                        <div className='chatbot-container'>
                            <div className='chatbot__header'>
                                <h2>ChatBot</h2>
                                <IconButton
                                    className='chatbot__close'
                                    onClick={() => setOpen(!open)}
                                >
                                    <CloseRounded size={32} />
                                </IconButton>
                            </div>
                            <div className='chatbot__body'>
                                {
                                    messages.map((message, index) => (
                                        <Message key={index} message={message} />
                                    ))
                                }
                            </div>
                            <div className='chatbot__footer'>
                                <input
                                    ref={inputRef}
                                    className='chatbot__input'
                                    placeholder='Type a message...'
                                    onKeyPress={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSend();
                                            event.preventDefault(); // prevent form submission and page reload
                                        }
                                    }}
                                />
                                <button
                                    className='chatbot__send'
                                    onClick={handleSend}
                                >
                                    <SendRounded size={32} sx={{
                                        color: 'white'
                                    }} />
                                </button>
                            </div>
                        </div>
                    ) :
                    (
                        <Fab
                            className='fab_chatbot__button'
                            size="large"
                            sx={
                                {
                                    position: 'fixed',
                                    bottom: 16,
                                    left: 16,
                                }
                            }
                            color="primary"
                            aria-label="add"
                            disabled={isLocked}
                            onClick={() => setOpen(!open)}
                        >
                            <Chat size={32} />
                        </Fab>
                    )
            }
        </div>
    )
}
