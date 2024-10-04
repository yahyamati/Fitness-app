import React, { useState } from 'react';
import Exercise from '../Components/Exercise';
import Chat from '../chat/Chat'; 

const Home = () => {
  const [showChat, setShowChat] = useState(false); 

  const toggleChat = () => {
    setShowChat(!showChat); 
  };

  return (
    <section className="h-screen bg-home-bg bg-cover bg-center flex items-center justify-center w-full">
      <div className="w-full">
        <Exercise />

        {/* Floating Button to toggle the Chat */}
        <div
          className='bg-white rounded-full w-[50px] h-[50px] cursor-pointer fixed bottom-6 right-4 flex items-center justify-center shadow-lg'
          onClick={toggleChat} 
        >
          
          💬
        </div>

        
        {showChat && (
          <div className="fixed bottom-20 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
            <Chat />
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
