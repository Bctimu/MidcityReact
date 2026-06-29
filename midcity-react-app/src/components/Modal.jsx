import { useNavigate } from 'react-router-dom';

function Modal({ business, onClose }) {
  const navigate = useNavigate();

  if (!business) return null;

  function handleGenerateQR() {
    onClose();
    navigate('/qr-code');
  }

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-midcity-card rounded-xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">{business.discount || '10% Off All Purchases'}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* QR Code Button */}
        <div className="p-6">
          <button
            onClick={handleGenerateQR}
            className="block w-full bg-midcity-red text-white text-center py-16 rounded-lg text-2xl font-bold tracking-wider hover:bg-red-900 transition-colors"
          >
            GENERATE QR CODE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
