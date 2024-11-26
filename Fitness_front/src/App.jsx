import { Suspense, useState,lazy  } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Loading from './Loading';
// import Home from './Home/Home';
import ExerciseDetail from './Components/ExerciseDetail';
import Footer from './Components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from './translition/langue';
import Registration from './Components/Registration';
import Note from './Components/note';
import CategoryDetail from './Components/CategoryDetail';
import Exercise from './Components/Exercise';
import Favorits from './Components/Favorits';
import { Toaster } from "@/components/ui/toaster"
// import Product from './Components/Product/Product';
import ChatSocket from './Components/SocketChat/ChatSocket';
import Profile from './Components/Profile/Profile';
const NotFound = lazy(() => import('./NotFound'));
// import OAuthCallback from './Components/OAuthCallback';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        
        {showLogin && <Registration setShowLogin={setShowLogin} />}

        <Toaster/>

        <Navbar setShowLogin={setShowLogin} />

        <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Exercise />} />
          <Route path="/exercises/bodyPart/:bodyPart" element={<CategoryDetail />} />
          <Route path="/exercises/detail/:bodyPart/:name" element={<ExerciseDetail />} />
          <Route path="/note" element={<Note />} />
          <Route path="/favorites" element={<Favorits />} />
          <Route path="/Message" element={<ChatSocket />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/callback" element={<OAuthCallback />} /> */}
          {/* <Route path="/product" element={<Product />} /> */}
         
          {/* <Route path="/Registration" element={<Registration setShowLogin={setShowLogin} />} /> */}
        </Routes>
        </Suspense>
        {/* <Footer />   */}
      </Router>
    </I18nextProvider>
  );
}

export default App;
