import React, { useState } from 'react';
import axios from 'axios';
import { ChatMessage, ApiResponse } from './types';

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [step, setStep] = useState<number>(0);
    const [userData, setUserData] = useState<{ gender?: string; experience?: string; weight?: string; workoutPart?: string }>({});

    const questions = [
        "What is your gender?",
        "How experienced are you? (Beginner, Intermediate, Advanced)",
        "How much do you weigh?",
        "Which part would you like to work out today?"
    ];

    const handleSend = async () => {
        if (!message.trim()) return; // Prevent sending empty messages

        const userMessage: ChatMessage = { sender: 'user', text: message };
        setChatHistory((prevHistory) => [...prevHistory, userMessage]);
        setMessage('');

        if (step < questions.length - 1) {
            // Save user's response
            const key = step === 0 ? 'gender' : step === 1 ? 'experience' : step === 2 ? 'weight' : 'workoutPart';
            setUserData((prevData) => ({ ...prevData, [key]: message }));

            // Move to next question
            setStep((prevStep) => prevStep + 1);
            // Add the next question to chat history
            const nextQuestionMessage: ChatMessage = { sender: 'gpt', text: questions[step + 1] };
            setChatHistory((prevHistory) => [...prevHistory, nextQuestionMessage]);
        } else {
            // All questions answered, prepare to fetch suggestions
            const suggestionsMessage = `Suggest some exercises for a ${userData.gender}, who is ${userData.experience}, weighs ${userData.weight}, and wants to work out ${message}.`;
            try {
                const response = await axios.post<ApiResponse>('https://chatgpt-42.p.rapidapi.com/conversationgpt4-2', {
                    messages: [{ role: 'user', content: suggestionsMessage }],
                    system_prompt: "",
                    temperature: 0.9,
                    top_k: 5,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
                        'x-rapidapi-key': '701756e02fmsh738bc48d73bfa7ap18dcb3jsn91e55002f279', // Ensure this is kept secure
                    },
                });

                // Check if result exists and extract the GPT response
                if (response.data.result) {
                    const gptMessage: ChatMessage = {
                        sender: 'gpt',
                        text: response.data.result.trim(),
                    };

                    // Update the chat history with the GPT response
                    setChatHistory((prevHistory) => [...prevHistory, gptMessage]);
                } else {
                    const errorMessage: ChatMessage = {
                        sender: 'gpt',
                        text: 'No response from the model.',
                    };
                    setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
                }
            } catch (error) {
                console.error('Error fetching exercise suggestions:', error);
                const errorMessage: ChatMessage = {
                    sender: 'gpt',
                    text: 'Error: Could not get exercise suggestions.',
                };
                setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-history" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className={chat.sender}>
                        <strong>{chat.sender === 'user' ? 'You: ' : 'GPT: '}</strong>
                        {chat.text}
                    </div>
                ))}
            </div>
            <input
            
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={step < questions.length ? questions[step] : "Type your message..."}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default Chat;
