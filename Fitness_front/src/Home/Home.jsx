import React from 'react';
import Exercise from '../Components/Exercise';

const Home = () => {
  return (
    <section className="h-screen bg-home-bg bg-cover bg-center flex items-center justify-center w-full"> {/* Added w-full */}
      <div className="w-full"> 
        <Exercise />
      </div>
    </section>
  );
};

export default Home;
