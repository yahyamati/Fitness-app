export interface ChatMessage {
    sender: 'user' | 'gpt';
    text: string;
}

export interface ApiResponse {
    choices: {
        content: any; text: string 
}[];
    
}
