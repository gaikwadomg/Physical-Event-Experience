import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { StadiumProvider } from './context/StadiumContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import NavigationPage from './pages/NavigationPage';
import FoodPage from './pages/FoodPage';
import QueuePage from './pages/QueuePage';
import WashroomPage from './pages/WashroomPage';
import EmergencyPage from './pages/EmergencyPage';
import GamePage from './pages/GamePage';

// ── Protected Route wrapper ──
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="landing-loader">
        <div className="landing-loader-ring" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  return children;
}

// ── App Layout: hides Navbar on landing page ──
function AppLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/landing';
  const { isAuthenticated, loading } = useAuth();

  return (
    <>
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

      <main id="main-content" className={isLanding ? '' : 'app-container'} role="main">
        <Routes>
          {/* Landing page: redirect to home if already authenticated */}
          <Route
            path="/landing"
            element={
              !loading && isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LandingPage />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/navigate"
            element={
              <ProtectedRoute>
                <NavigationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food"
            element={
              <ProtectedRoute>
                <FoodPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <QueuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/washroom"
            element={
              <ProtectedRoute>
                <WashroomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <EmergencyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirect to landing or home */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/' : '/landing'} replace />}
          />
        </Routes>
      </main>

      {/* Navbar hidden on landing page */}
      {!isLanding && isAuthenticated && <Navbar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StadiumProvider>
          <AppLayout />
        </StadiumProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
