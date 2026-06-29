import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [view, setView] = useState('roleSelect'); // roleSelect, residentLogin, residentSignup, merchantLogin, merchantSignup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingSignup, setPendingSignup] = useState(null);

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  function resetFields() {
    setEmail('');
    setPassword('');
    setUsername('');
    setBusinessName('');
    setError('');
  }

  async function handleSignup(e, role) {
    e.preventDefault();
    setError('');

    if (role === 'resident' && (!username || !email || !password)) {
      setError('Please fill in all fields');
      return;
    }
    if (role === 'merchant' && (!businessName || !email || !password)) {
      setError('Please fill in all fields');
      return;
    }

    // Show terms first
    setPendingSignup({ role });
    setShowTerms(true);
  }

  async function confirmSignup() {
    setShowTerms(false);
    setLoading(true);
    try {
      const role = pendingSignup.role;
      await signup(email, password, username, role, businessName);
      if (role === 'merchant') {
        navigate('/scanner');
      } else {
        navigate('/home');
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
    setPendingSignup(null);
  }

  async function handleLogin(e, role) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      // Check role from Firestore
      if (role === 'merchant') {
        navigate('/scanner');
      } else {
        navigate('/home');
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  }

  // Terms and Conditions Modal
  if (showTerms) {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-midcity-card rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-white">Terms & Conditions</h2>
          <div className="text-gray-300 text-sm space-y-3 mb-6">
            <p><strong>MidCity Resident App - Terms & Conditions</strong></p>
            <p>Effective Date: 7/18/25<br/>Last Updated: 7/18/2025</p>
            <p>Welcome to the MidCity Resident App ("App"). These Terms of Use ("Terms"), govern your access to and use of the App. By creating an account and using the App, you agree to comply with these Terms.</p>
            <p><strong>1. Eligibility</strong><br/>This App is intended exclusively for residents of communities located within the MidCity District. Access is granted based on lease status and may be revoked when your lease ends.</p>
            <p><strong>2. Account & Access</strong><br/>You may only access the App using a valid login tied to your current lease. Access credentials will be provided by your leasing office. You are responsible for maintaining the confidentiality of your login credentials. Your account will be deactivated upon lease termination.</p>
            <p><strong>3. App Functionality</strong><br/>This App provides: Access to exclusive discount offerings from participating MidCity vendors. A link to view upcoming events. Future features may include: Vendor updates or special offers.</p>
            <p><strong>4. Appropriate Use</strong><br/>You agree to: Use the App only for its intended purpose. Not share your login with others. Not attempt to reverse-engineer, exploit, or damage the App.</p>
            <p><strong>5. Vendor Offers</strong><br/>Discounts and vendor offerings reflect the policies of the participating businesses. We make no guarantees regarding availability, redemption, or quality of third-party offers.</p>
            <p><strong>6. Termination</strong><br/>We may suspend or terminate your access if: Your lease ends or is no longer valid. You violate these Terms.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmSignup}
              className="flex-1 bg-midcity-red text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'I Agree'}
            </button>
            <button
              onClick={() => { setShowTerms(false); setPendingSignup(null); }}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role Selection
  if (view === 'roleSelect') {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Welcome to MidCity App</h1>
          <div className="space-y-4">
            <button
              onClick={() => { resetFields(); setView('merchantLogin'); }}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors"
              style={{ backgroundColor: '#4169E1' }}
            >
              Merchant Login
            </button>
            <button
              onClick={() => { resetFields(); setView('residentSignup'); }}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors"
              style={{ backgroundColor: '#7B3FF2' }}
            >
              Resident Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Resident Signup
  if (view === 'residentSignup') {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-midcity-card rounded-2xl p-8 max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="https://image2url.com/r2/default/images/1771293633192-63e0c098-cd1e-41bf-956d-c70cf7e38494.avif" alt="MidCity" className="w-14 h-14 rounded-full object-cover" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-1">The MidCity App</h1>
          <p className="text-gray-400 text-center text-sm mb-6">
            Your hometown perks in one place. Exclusive discounts for local residents!
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleSignup(e, 'resident')}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-midcity-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'SIGNUP'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400 text-sm">
            Already Have An Account?{' '}
            <button
              onClick={() => { resetFields(); setView('residentLogin'); }}
              className="text-midcity-red font-semibold hover:underline"
            >
              LOG IN
            </button>
          </p>
          <button
            onClick={() => { resetFields(); setView('roleSelect'); }}
            className="block mx-auto mt-3 text-gray-500 text-sm hover:text-white transition-colors"
          >
            &larr; Back to role selection
          </button>
        </div>
      </div>
    );
  }

  // Resident Login
  if (view === 'residentLogin') {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-midcity-card rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <img src="https://image2url.com/r2/default/images/1771293633192-63e0c098-cd1e-41bf-956d-c70cf7e38494.avif" alt="MidCity" className="w-14 h-14 rounded-full object-cover" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Resident Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e, 'resident')}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-midcity-red text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => { resetFields(); setView('residentSignup'); }}
              className="text-midcity-red font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
          <button
            onClick={() => { resetFields(); setView('roleSelect'); }}
            className="block mx-auto mt-3 text-gray-500 text-sm hover:text-white transition-colors"
          >
            &larr; Back to role selection
          </button>
        </div>
      </div>
    );
  }

  // Merchant Login
  if (view === 'merchantLogin') {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-midcity-card rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <img src="https://image2url.com/r2/default/images/1771293633192-63e0c098-cd1e-41bf-956d-c70cf7e38494.avif" alt="MidCity" className="w-14 h-14 rounded-full object-cover" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Merchant Login</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e, 'merchant')}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-midcity-red"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={() => { resetFields(); setView('merchantSignup'); }}
              className="text-blue-400 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
          <button
            onClick={() => { resetFields(); setView('roleSelect'); }}
            className="block mx-auto mt-3 text-gray-500 text-sm hover:text-white transition-colors"
          >
            &larr; Back to role selection
          </button>
        </div>
      </div>
    );
  }

  // Merchant Signup
  if (view === 'merchantSignup') {
    return (
      <div className="min-h-screen bg-midcity-dark flex items-center justify-center p-4">
        <div className="bg-midcity-card rounded-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <img src="https://image2url.com/r2/default/images/1771293633192-63e0c098-cd1e-41bf-956d-c70cf7e38494.avif" alt="MidCity" className="w-14 h-14 rounded-full object-cover" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Merchant Sign Up</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleSignup(e, 'merchant')}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                placeholder="Enter business name..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'SIGNUP'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400 text-sm">
            Already Have An Account?{' '}
            <button
              onClick={() => { resetFields(); setView('merchantLogin'); }}
              className="text-blue-400 font-semibold hover:underline"
            >
              LOG IN
            </button>
          </p>
          <button
            onClick={() => { resetFields(); setView('roleSelect'); }}
            className="block mx-auto mt-3 text-gray-500 text-sm hover:text-white transition-colors"
          >
            &larr; Back to role selection
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default Login;
