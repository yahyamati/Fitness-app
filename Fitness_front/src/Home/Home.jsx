import React from 'react';
import Exercise from '../Components/Exercise';

const Home = () => {
  return (
    <section className="h-screen bg-home-bg bg-cover bg-center flex items-center justify-center w-full"> {/* Added w-full */}
      <div className="w-full"> 
        <Exercise />
        {/* <div className='bg-white rounded-full w-[50px] w-[50px] h-[50px]' >
         
        </div> */}
        
      </div>
    </section>
  );
};

export default Home;
