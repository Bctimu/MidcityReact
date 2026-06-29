import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const [screen, setScreen] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-midcity-dark text-white">
      {screen === 1 && (
        <div className="flex flex-col items-center px-4 pb-12">
          {/* Header with logo */}
          <div className="w-full bg-black py-3 flex justify-center items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">&#9776;</span>
              <div className="w-10 h-10 rounded-full bg-midcity-red flex items-center justify-center">
                <span className="text-white text-xs font-bold italic">Mid<br/>City</span>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="w-full max-w-md mt-0">
            <img
              src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&q=80"
              alt="MidCity aerial view"
              className="w-full h-56 object-cover rounded-b-lg"
            />
          </div>

          {/* MidCity logo badge */}
          <div className="w-16 h-16 rounded-full bg-midcity-red flex items-center justify-center mt-6 border-2 border-white/20">
            <span className="text-white text-xs font-bold italic leading-tight text-center">Mid<br/>City</span>
          </div>

          {/* Welcome text */}
          <h1 className="text-3xl font-bold mt-6 text-center">Welcome To MidCity!</h1>
          <p className="text-gray-300 text-center mt-4 max-w-sm leading-relaxed">
            MidCity is a vibrant community where neighbors come together to enjoy local
            shopping, dining and entertainment. Designed with charm and connection in mind,
            it's a place where small businesses thrive, residents support each other, and
            there's always something happening just around the corner.
          </p>

          {/* Community image */}
          <div className="w-full max-w-md mt-8">
            <img
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80"
              alt="Community event"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Next button */}
          <button
            onClick={() => setScreen(2)}
            className="mt-8 bg-midcity-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-colors"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {screen === 2 && (
        <div className="flex flex-col items-center px-4 py-12">
          {/* Header with logo */}
          <div className="w-full bg-black py-3 flex justify-center items-center fixed top-0 z-10">
            <div className="w-10 h-10 rounded-full bg-midcity-red flex items-center justify-center">
              <span className="text-white text-xs font-bold italic">Mid<br/>City</span>
            </div>
          </div>

          <div className="mt-16 max-w-sm text-center">
            <h1 className="text-3xl font-bold mb-6">Your App, Your Advantage</h1>
            <p className="text-gray-300 leading-relaxed">
              We built this app to make MidCity living even better for you. Whether you're
              grabbing coffee at your favorite local spot or attending a weekend market,
              the app helps you stay connected and save while doing it. With exclusive
              discounts, insider events and community updates&mdash; all in one place&mdash;
              you'll get more out of every day in MidCity. It's convenience, perks and
              community all in the palm of your hand.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="mt-10 bg-midcity-red text-white px-10 py-3 rounded-full font-semibold hover:bg-red-900 transition-colors text-lg"
            >
              Get Started
            </button>

            <button
              onClick={() => setScreen(1)}
              className="mt-4 text-gray-400 hover:text-white transition-colors"
            >
              &larr; Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Welcome;
