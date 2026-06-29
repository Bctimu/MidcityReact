import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userData } = useAuth();

  const isMerchant = userData?.role === 'merchant';

  const commonItems = [
    { icon: 'https://image2url.com/r2/default/images/1771297736886-9ff3e3ac-f5df-42ca-86e6-a284a98fe122.png', label: 'Home', path: '/home' },
    { icon: 'https://image2url.com/r2/default/images/1771297756986-a6d987a0-57d9-4229-aaed-f6b3884aa79f.png', label: 'Discount Library', path: '/discounts' },
    { icon: 'https://image2url.com/r2/default/images/1771297716737-6f5c5696-19d3-4c41-9294-cc29840c680d.png', label: 'Events', external: 'https://www.midcitydistrict.com/events' },
    { icon: 'https://image2url.com/r2/default/images/1771297851585-7c7faf3e-7431-4d10-986f-decaa248fb4d.png', label: 'Tutorials', path: '/tutorials' },
  ];

  const roleItems = isMerchant
    ? [
        { icon: 'https://image2url.com/r2/default/images/1771363055638-84330692-d33c-4eba-8b82-adc8c1f16c0d.png', label: 'Scanner', path: '/scanner' },
        { icon: 'https://image2url.com/r2/default/images/1771363092157-38438ff5-d59d-462f-ba98-ccf398c6180b.png', label: 'Analytics', path: '/analytics' },
      ]
    : [
        { icon: 'https://image2url.com/r2/default/images/1771362506001-965bd6b3-fe2d-4934-9e77-700d77aa1681.png', label: 'My QR Code', path: '/qr-code' },
      ];

  const menuItems = [...commonItems, ...roleItems];

  function handleNavClick(item) {
    if (item.external) {
      window.open(item.external, '_blank');
    } else {
      navigate(item.path);
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-full bg-black z-50 flex flex-col" style={{ width: '290px', borderRight: '1px solid #212121' }}>
      {/* Logo */}
      <div className="p-4" style={{ borderBottom: '1px solid #212121' }}>
        <img src="https://image2url.com/r2/default/images/1771293633192-63e0c098-cd1e-41bf-956d-c70cf7e38494.avif" alt="MidCity" className="w-10 h-10 rounded-full object-cover" />
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = !item.external && location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors rounded-xl ${
                isActive
                  ? 'bg-midcity-red text-white'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {item.icon.startsWith('http') ? (
                <img src={item.icon} alt={item.label} className="object-contain" style={{ width: '24px', height: '24px' }} />
              ) : (
                <span style={{ width: '24px', height: '24px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
              )}
              <span className="font-medium" style={{ fontSize: '16px' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tips & Tricks card */}
      <div className="mx-3 mb-4 p-3 bg-black rounded-lg">
        <p className="text-white text-sm font-semibold">Tips & Tricks</p>
        <p className="text-gray-400 text-xs mt-1">Head over to our website to learn more!</p>
        <a
          href="https://www.midcitydistrict.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 bg-midcity-red text-white text-xs px-3 py-1.5 rounded-md hover:bg-red-900 transition-colors"
        >
          ↗ Learn More
        </a>
      </div>

      {/* User info */}
      <div
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors"
        style={{ borderTop: '1px solid #212121' }}
        onClick={() => navigate('/account')}
      >
        <div className="rounded-full bg-gray-600 flex items-center justify-center" style={{ width: '48px', height: '48px' }}>
          <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-white font-medium" style={{ fontSize: '16px' }}>
          {userData?.fullName || 'User'}
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
