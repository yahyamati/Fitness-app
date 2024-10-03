import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail'; // Create a detail page for exercise

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Define routes for different pages */}
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:name" element={<ExerciseDetail />} /> {/* Dynamic route for exercise by name */}
      </Routes>
    </Router>
  );
}

export default App;
