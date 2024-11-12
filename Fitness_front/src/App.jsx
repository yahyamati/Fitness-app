import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
// import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail';
import Footer from './Components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from './translition/langue';
import Registration from './Components/Registration';
import { useState } from 'react';
import Note from './Components/note';
import CategoryDetail from './Components/CategoryDetail';
import Exercise from './Components/Exercise';
import Favorits from './Components/Favorits';
import { Toaster } from "@/components/ui/toaster"
import Product from './Components/Product/Product';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        
        {showLogin && <Registration setShowLogin={setShowLogin} />}

        <Toaster/>

        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Exercise />} />
          <Route path="/exercise/category/:category" element={<CategoryDetail />} />
          <Route path="/exercise/detail/:name" element={<ExerciseDetail />} />
          <Route path="/note" element={<Note />} />
          <Route path="/favorites" element={<Favorits />} />
          {/* <Route path="/product" element={<Product />} /> */}
         
          {/* <Route path="/Registration" element={<Registration setShowLogin={setShowLogin} />} /> */}
        </Routes>
        {/* <Footer /> */}
      </Router>
    </I18nextProvider>
  );
}

export default App;
