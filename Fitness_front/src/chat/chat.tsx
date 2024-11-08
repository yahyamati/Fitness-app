import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatMessage } from './types';
import { FaRedo } from 'react-icons/fa';

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [step, setStep] = useState<number>(0);
    const [userData, setUserData] = useState<{ gender?: string; experience?: string; weight?: string; workoutPart?: string }>({});
    const [questions, setQuestions] = useState<string[]>([]);
    const [resultsFetched, setResultsFetched] = useState<boolean>(false);
    

    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/chat/questions');
                setQuestions(response.data);
               

                
                const initialQuestion: ChatMessage = { sender: 'gpt', text: response.data[0] };
                setChatHistory([initialQuestion]);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: message };
        setChatHistory((prevHistory) => [...prevHistory, userMessage]);
        setMessage('');

        const keys = ['gender', 'experience', 'weight', 'workoutPart'];

        
        if (step < keys.length) {
            try {
                const response = await axios.post('http://localhost:8080/api/chat/message', { text: message });
                
                if (response.data.message) {
                    const botMessage: ChatMessage = { sender: 'gpt', text: response.data.message };
                    setChatHistory((prevHistory) => [...prevHistory, botMessage]);
                    setUserData((prevData) => ({ ...prevData, [keys[step]]: message }));
                    setStep((prevStep) => prevStep + 1);
                } else if (response.data.suggestions) {
                    const suggestions = response.data.suggestions.split(';').map((s) => `- ${s.trim()}`).join('\n');
                    const botMessage: ChatMessage = { sender: 'gpt', text: `Here are some suggested exercises:\n${suggestions}` };
                    setChatHistory((prevHistory) => [...prevHistory, botMessage]);
                    setResultsFetched(true);
                   
                }
            } catch (error) {
                console.error('Error in handleSend:', error);
                const errorMessage: ChatMessage = { sender: 'gpt', text: 'Error: Could not process your request.' };
                setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
            }
        } else {
            
            try {
                const resultResponse = await axios.get('http://localhost:8080/api/chat/result');
                const suggestions = resultResponse.data;
                const botMessage: ChatMessage = suggestions
                    ? { sender: 'gpt', text: `Here are some suggested exercises:\n${suggestions}` }
                    : { sender: 'gpt', text: 'No exercise suggestions available.' };
                setChatHistory((prevHistory) => [...prevHistory, botMessage]);
                setResultsFetched(true);
               
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                const errorMessage: ChatMessage = { sender: 'gpt', text: 'Error: Could not get exercise suggestions.' };
                setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
            }
        }
    };

    const handleRestart = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/chat/restart');
            const restartMessage: ChatMessage = { sender: 'gpt', text: response.data };
            setChatHistory([restartMessage]);
            setStep(0);
            setUserData({});
            setResultsFetched(false);
        } catch (err) {
            console.error('Error restarting session', err);
        }
    };

    return (
        <div className="bg-customGray h-[500px] flex flex-col justify-between p-3">
            <div className="flex-1 overflow-y-auto space-y-4 pb-5 scrollbar-hide">
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}
                    >
                        <div
                            className={`p-3 rounded-lg ${chat.sender === 'user' ? 'bg-input text-white max-w-xs text-right' : 'bg-input text-white max-w-xs text-left'}`}
                        >
                            <strong>{chat.sender === 'user' ? 'You: ' : 'GPT: '}</strong>
                            {chat.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message ChatGPT"
                        className="w-full p-3 pl-4 pr-12 bg-input border border-gray-600 rounded-full text-white"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute inset-y-0 right-3 flex items-center justify-center text-white"
                    >
                        
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-6 transform rotate--180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </button>
                </div>
                
                    <button
                        onClick={handleRestart}
                        className="ml-2 m-auto bg-input text-white p-2 rounded-full flex items-center justify-center"
                    >
                        <FaRedo />
                    </button>
                
            </div>
        </div>
    );
};

export default Chat;
