import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StadiumProvider } from './context/StadiumContext';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import NavigationPage from './pages/NavigationPage';
import FoodPage from './pages/FoodPage';
import QueuePage from './pages/QueuePage';
import WashroomPage from './pages/WashroomPage';
import EmergencyPage from './pages/EmergencyPage';
import GamePage from './pages/GamePage';

export default function App() {
  return (
    <BrowserRouter>
      <StadiumProvider>
        {/* Accessibility: Skip to main content link */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0d1117',
              color: '#e6edf3',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '0.85rem',
            },
          }}
        />
        <main id="main-content" className="app-container" role="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/navigate" element={<NavigationPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/washroom" element={<WashroomPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </main>
        <Navbar />
      </StadiumProvider>
    </BrowserRouter>
  );
}
