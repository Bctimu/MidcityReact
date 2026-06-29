import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-midcity-dark">
      <Sidebar />
      <div style={{ marginLeft: '290px' }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
