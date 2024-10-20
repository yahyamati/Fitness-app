import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail';
import Footer from './Components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from './translition/langue';
import Registration from './Components/Registration';
import { useState } from 'react';
import Note from './Components/note';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        
        {showLogin && <Registration setShowLogin={setShowLogin} />}

        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:name" element={<ExerciseDetail />} />
          <Route path="/note" element={<Note />} />

          {/* <Route path="/Registration" element={<Registration setShowLogin={setShowLogin} />} /> */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </I18nextProvider>
  );
}

export default App;
