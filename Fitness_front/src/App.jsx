import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:name" element={<ExerciseDetail />} /> 
      </Routes>
    </Router>
  );
}

export default App;
