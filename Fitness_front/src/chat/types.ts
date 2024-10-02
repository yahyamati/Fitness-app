export interface ChatMessage {
    sender: 'user' | 'gpt';
    text: string;
}

export interface ApiResponse {
    choices: {
        content: any; text: string 
}[];
    // Other fields can be added based on the API response structure
}
