import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail'; 
import Footer from './Components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:name" element={<ExerciseDetail />} /> 
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
