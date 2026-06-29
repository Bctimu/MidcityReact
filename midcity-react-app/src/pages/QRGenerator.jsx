import { useState, useRef, useCallback, useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';

const TOKEN_DURATION_SECONDS = 60;

function QRGenerator() {
  const { currentUser, userData } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  async function generateQR() {
    if (!currentUser) return;
    setGenerating(true);
    setError('');

    try {
      const token = crypto.randomUUID();
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + TOKEN_DURATION_SECONDS * 1000);

      await setDoc(doc(db, 'valid_tokens', token), {
        token,
        userId: currentUser.uid,
        createdAt: now,
        expiresAt,
      });

      const dataUrl = await QRCode.toDataURL(token, {
        width: 280,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      });

      setQrDataUrl(dataUrl);
      setTimeLeft(TOKEN_DURATION_SECONDS);

      clearTimer();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setQrDataUrl(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error generating QR:', err);
      setError('Failed to generate QR code. Please try again.');
    }
    setGenerating(false);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <main className="pb-24" style={{ padding: '24px', paddingLeft: '20px' }}>
      <section className="max-w-lg mx-auto text-center">
        <h1 className="text-white font-bold mb-2" style={{ fontSize: '28px' }}>
          Your QR Code
        </h1>
        <p className="text-gray-400 mb-8" style={{ fontSize: '16px' }}>
          {userData?.fullName
            ? `Welcome, ${userData.fullName}!`
            : 'Generate a QR code to redeem your discount.'}
        </p>

        {/* QR Display */}
        <div
          className="mx-auto flex items-center justify-center rounded-xl mb-6"
          style={{
            width: '320px',
            height: '320px',
            backgroundColor: qrDataUrl ? '#ffffff' : '#2a2a2a',
          }}
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" style={{ width: '280px', height: '280px' }} />
          ) : (
            <p className="text-gray-500" style={{ fontSize: '14px' }}>
              {timeLeft === 0 && !generating ? 'Press the button to generate' : ''}
            </p>
          )}
        </div>

        {/* Timer */}
        {timeLeft > 0 && (
          <div className="mb-6">
            <p className="text-white font-mono" style={{ fontSize: '32px' }}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
            <p className="text-gray-400 text-sm mt-1">Time remaining</p>
          </div>
        )}

        {timeLeft === 0 && qrDataUrl === null && !generating && (
          <p className="text-yellow-400 text-sm mb-4">
            {error || 'QR code expired or not yet generated.'}
          </p>
        )}

        {/* Generate Button */}
        <button
          onClick={generateQR}
          disabled={generating || timeLeft > 0}
          className="px-8 py-3 rounded-lg font-semibold transition-colors"
          style={{
            fontSize: '16px',
            backgroundColor: generating || timeLeft > 0 ? '#555' : '#890706',
            color: '#fff',
            cursor: generating || timeLeft > 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {generating ? 'Generating...' : timeLeft > 0 ? 'QR Active' : 'Generate QR Code'}
        </button>
      </section>
    </main>
  );
}

export default QRGenerator;
