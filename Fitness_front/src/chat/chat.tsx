import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatMessage } from './types';

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [step, setStep] = useState<number>(0);
    const [userData, setUserData] = useState<{ gender?: string; experience?: string; weight?: string; workoutPart?: string }>({});
    const [questions, setQuestions] = useState<string[]>([]);
    const [resultsFetched, setResultsFetched] = useState<boolean>(false); // State to track if results were fetched

    // Fetch questions from backend when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/chat/questions');
                setQuestions(response.data);
                // Add the first question to the chat history
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

        // Save user response based on the current step
        const keys = ['gender', 'experience', 'weight', 'workoutPart'];

        if (step < keys.length) {
            setUserData((prevData) => ({ ...prevData, [keys[step]]: message }));
            setStep((prevStep) => prevStep + 1);

            // Check if there is a next question to display
            if (step + 1 < questions.length) {
                const nextQuestionMessage: ChatMessage = { sender: 'gpt', text: questions[step + 1] };
                setChatHistory((prevHistory) => [...prevHistory, nextQuestionMessage]);
            }
        } else if (step === keys.length) {
            // When all questions are answered, send the user data to the backend
            try {
                const response = await axios.post('http://localhost:8080/api/chat/message', { text: message });
                console.log('API response:', response.data); // Debugging line

                // Fetch the results from the result endpoint
                const resultResponse = await axios.get('http://localhost:8080/api/chat/result');
                console.log('Result API response:', resultResponse.data); // Print the entire response for debugging

                // Assume resultResponse.data contains the suggestions as a string
                const suggestions: string = resultResponse.data;

                // Check if suggestions are available
                if (suggestions) {
                    // Display suggestions from the response
                    const botMessage: ChatMessage = {
                        sender: 'gpt',
                        text: `Here are some suggested exercises:\n${suggestions.split(';').map((suggestion) => `- ${suggestion.trim()}`).join('\n')}`
                    };
                    setChatHistory((prevHistory) => [...prevHistory, botMessage]);
                    setResultsFetched(true); // Mark that results were fetched
                } else {
                    const errorMessage: ChatMessage = { sender: 'gpt', text: 'No exercise suggestions available.' };
                    setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                const errorMessage: ChatMessage = { sender: 'gpt', text: 'Error: Could not get exercise suggestions.' };
                setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
            }
        }
    };

    const handleRestart = () => {
        // Reset the states to restart the chat
        setMessage('');
        setChatHistory([]);
        setStep(0);
        setUserData({});
        setResultsFetched(false);
        
        // Fetch questions again if needed
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
                        {/* Vertical Arrow Icon (resembling ChatGPT's send icon) */}
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
            </div>
            {resultsFetched && ( // Show restart button if results have been fetched
                <button
                    onClick={handleRestart}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Restart
                </button>
            )}
        </div>
    );
};

export default Chat;
