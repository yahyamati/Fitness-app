import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail';
import Footer from './Components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from './translition/langue';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:name" element={<ExerciseDetail />} />
        </Routes>
        <Footer />
      </Router>
    </I18nextProvider>
  );
}

export default App;
