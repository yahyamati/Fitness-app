import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatMessage, ApiResponse } from './types';

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [step, setStep] = useState<number>(0);
    const [userData, setUserData] = useState<{ gender?: string; experience?: string; weight?: string; workoutPart?: string }>({});

    const questions = [
        "What is your gender? (Male , Female)",
        "How experienced are you? (Beginner, Intermediate, Advanced)",
        "How much do you weigh?",
        "Which part would you like to work out today?"
    ];

    // Add the first question on component load
    useEffect(() => {
        const initialQuestion: ChatMessage = { sender: 'gpt', text: questions[0] };
        setChatHistory([initialQuestion]);
    }, []);

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
            const suggestionsMessage = `Suggest 5 exercises for a ${userData.gender}, who is ${userData.experience}, weighs ${userData.weight}, and wants to work out ${message}. Without explanation, and give me only how many sets to do.`;
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
                    const gptResponseText = response.data.result.trim();
    
                    // Split the GPT response into lines and create an array of objects (exercise and sets)
                    const exercises = gptResponseText.split('\n').map((line) => {
                        const [exercise, set] = line.split(':');
                        return { exercise: exercise?.trim(), set: set?.trim() };
                    });
    
                    // Convert the exercises array into a table format
                    const tableMessage: ChatMessage = {
                        sender: 'gpt',
                        text: (
                            <table className="table-auto w-full text-left">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2">Exercise</th>
                                        <th className="px-4 py-2">Sets</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercises.map((ex, index) => (
                                        <tr key={index}>
                                            <td className="border px-4 py-2">{ex.exercise}</td>
                                            <td className="border px-4 py-2">{ex.set}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) as unknown as string, // Trick TypeScript to accept JSX
                    };
    
                    // Update the chat history with the GPT response
                    setChatHistory((prevHistory) => [...prevHistory, tableMessage]);
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
        <div className="bg-customGray h-screen flex flex-col justify-between p-4">
            <div className="flex-1 overflow-y-auto space-y-4">
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}
                    >
                        <div
                            className={`p-3 rounded-lg ${
                                chat.sender === 'user'
                                    ? 'bg-input text-white max-w-xs text-right'
                                    : 'bg-input text-white max-w-xs text-left'
                            }`}
                        >
                            <strong>{chat.sender === 'user' ? 'You: ' : 'GPT: '}</strong>
                            {chat.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message ChatGPT"
                    className="flex-1 p-3 ml-3 bg-input border border-gray-600 rounded-full text-white"
                />
                <button
                    onClick={handleSend}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
