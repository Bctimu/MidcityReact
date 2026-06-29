import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import DiscountLibrary from './pages/DiscountLibrary';
import Tutorials from './pages/Tutorials';
import AccountSettings from './pages/AccountSettings';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return currentUser ? <Layout>{children}</Layout> : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return currentUser ? <Navigate to="/home" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discounts"
        element={
          <ProtectedRoute>
            <DiscountLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutorials"
        element={
          <ProtectedRoute>
            <Tutorials />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr-code"
        element={
          <ProtectedRoute>
            <QRGenerator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scanner"
        element={
          <ProtectedRoute>
            <QRScanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
