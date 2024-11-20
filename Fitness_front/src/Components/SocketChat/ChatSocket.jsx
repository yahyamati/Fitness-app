import React, { useEffect, useState,useRef  } from 'react';
import { io } from 'socket.io-client';
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { MessageCircle, Send, User,ArrowLeft  } from 'lucide-react';
import {  FaSearch  } from 'react-icons/fa'

const ChatSocket = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error('Error decoding token:', error);
        setError('Invalid token format');
      }
    }
  }, []);

  
  const fetchUsers = async () => {
    setLoadingUsers(true); 
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId

  
      if (!token) {
        setError('No token found. Please log in again.');
        setLoadingUsers(false);
        return;
      }
  
      const response = await fetch('http://localhost:3000/node-api/api/Profiles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
  
      const data = await response.json();
     
     
      if (Array.isArray(data)) {
        //display all users only current user
        const filteredUsers = data.filter(user => user._id !== userId);
        setUsers(filteredUsers);
      } else {
        setError('Invalid response format');
      }
  
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoadingUsers(false); 
    }
  };

  
  //filter user by name
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    // Initialize socket connection
    const socketInstance = io('http://localhost:4000', {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to chat server');
      setConnected(true);
      setError('');
      fetchUsers(); 
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
      setError(`Connection error: ${err.message}`);
      setConnected(false);
    });

    socketInstance.on('newMessage', (data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.off('connect');
      socketInstance.off('connect_error');
      socketInstance.off('newMessage');
      socketInstance.disconnect();
    };
  }, []); 

  useEffect(() => {
    if (selectedUser && currentUser) {
      loadChatHistory();
    }
  }, [selectedUser, currentUser]);

  const loadChatHistory = async () => {
    if (!selectedUser || !currentUser) return;
  
    console.log(`Loading chat history for ${currentUser.userId} and ${selectedUser._id}`);
  
    try {
      const response = await axios.get(
        `http://localhost:3000/node-api/api/Messages/${currentUser.userId}/${selectedUser._id}`
      );
  
      if (response.status !== 200) throw new Error('Failed to load chat history');
  
      const data = response.data;
  
      if (data.success && Array.isArray(data.data)) {
        console.log(data);
        const fetchedMessages = data.data.map((message) => ({
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          timestamp: message.timestamp, 
        }));
  
        
        setMessages(fetchedMessages);
  
        
        if (fetchedMessages.length === 0) {
          console.log('No messages found between the users.');
        }
      } else {
        
        setMessages([]);
      }
    } catch (error) {
      console.error('Chat history error:', error);
  
      
      if (error.response && error.response.status === 404) {
        console.log('No chat history found.');
        setMessages([]);
      } else {
        setError('Failed to load chat history');
      }
    }
  };
  
  const sendMessage = () => {
    if (!message.trim()) return; 
    if (!selectedUser) {
      setError('Please select a user to send a message to.');
      return;
    }

    if (!selectedUser._id) { 
      setError('No valid user selected.');
      console.log('Selected user details:', selectedUser);
      return;
    }

    console.log('Sending message to:', selectedUser._id);

    socket.emit('sendMessage', {
      receiverId: selectedUser._id,
      content: message,
    });

    setMessages((prev) => [
      ...prev,
      {
        senderId: currentUser.userId,
        receiverId: selectedUser._id,
        content: message,
        timestamp: new Date(),
      },
    ]);

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

//for scroll chat from bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);






  // Updated main layout with proper mobile responsiveness
  return (
    <div className="pt-12 flex h-screen bg-gray-100">
      {/* Users list - Hidden on mobile when chat is open */}
      <div 
        className={`${
          selectedUser ? 'hidden md:block' : 'block'
        } w-full md:w-1/4 h-full`}
      >
        
        

        <div className="bg-white border-r border-gray-200 p-4 h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chats
        </h2>
        {connected && <div className="text-sm text-green-500">Connected</div>}
        {error && <div className="text-sm text-red-500">Roh fixi l'error ya ***</div>}
      </div>
      <div className="w-full max-w-md mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your gym bro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      {loadingUsers ? (
        <div className="text-gray-500">Loading users...</div>
      ) : (
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                selectedUser?._id === user._id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <User className="w-8 h-8 text-gray-500" />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">
                  {connected ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </div>

      {/* Chat area - Full screen on mobile when open */}
      <div 
        className={`${
          selectedUser ? 'block' : 'hidden md:block'
        } flex-1 h-full`}
      >
        {selectedUser ? (
          


          <div className="flex flex-col h-full">
      {/* Chat header with back button for mobile */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold">{selectedUser.name}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === currentUser?.userId;
          return (
            <div
              key={index}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  isOwnMessage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <div>{msg.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 p-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
        ) : (
          <div className="hidden md:flex h-full justify-center items-center text-gray-500">
            Select your gym bro to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSocket;
