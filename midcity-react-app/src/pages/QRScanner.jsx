import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Html5Qrcode } from 'html5-qrcode';

function QRScanner() {
  const { currentUser } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(''); // 'success' | 'error' | 'expired' | ''
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const scannerElementId = 'qr-reader';

  async function startScanner() {
    setError('');
    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setError('No cameras found on this device.');
        return;
      }

      const scanner = new Html5Qrcode(scannerElementId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanSuccess,
        () => {} // ignore scan failures (no QR in frame)
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError('Could not start camera. Please allow camera permissions.');
    }
  }

  async function stopScanner() {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        // ignore stop errors
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  }

  async function handleScanSuccess(decodedText) {
    // Pause scanning while we validate
    if (scannerRef.current) {
      try {
        await scannerRef.current.pause();
      } catch (e) {
        // ignore
      }
    }

    try {
      const tokenDoc = await getDoc(doc(db, 'valid_tokens', decodedText));

      if (!tokenDoc.exists()) {
        setScanResult('Invalid token');
        setScanStatus('error');
      } else {
        const tokenData = tokenDoc.data();
        const now = Timestamp.now();

        if (tokenData.expiresAt.toMillis() < now.toMillis()) {
          setScanResult('Token expired');
          setScanStatus('expired');
        } else {
          // Valid scan — log it
          await addDoc(collection(db, 'scans'), {
            token: decodedText,
            scannedAt: Timestamp.now(),
            scannedBy: currentUser.uid,
            originalUserId: tokenData.userId,
            createdAt: tokenData.createdAt,
          });

          setScanResult('Scan logged!');
          setScanStatus('success');
        }
      }
    } catch (err) {
      console.error('Validation error:', err);
      setScanResult('Error validating token');
      setScanStatus('error');
    }

    // Resume scanning after 2 seconds
    setTimeout(() => {
      setScanResult(null);
      setScanStatus('');
      if (scannerRef.current) {
        try {
          scannerRef.current.resume();
        } catch (e) {
          // ignore
        }
      }
    }, 2000);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const statusColors = {
    success: '#22c55e',
    error: '#ef4444',
    expired: '#f59e0b',
  };

  return (
    <main className="pb-24" style={{ padding: '24px', paddingLeft: '20px' }}>
      <section className="max-w-lg mx-auto text-center">
        <h1 className="text-white font-bold mb-2" style={{ fontSize: '28px' }}>
          QR Scanner
        </h1>
        <p className="text-gray-400 mb-8" style={{ fontSize: '16px' }}>
          Scan a resident's QR code to validate their discount.
        </p>

        {/* Scanner viewport */}
        <div
          className="mx-auto rounded-xl overflow-hidden mb-6"
          style={{
            width: '350px',
            height: '350px',
            backgroundColor: '#2a2a2a',
          }}
        >
          <div id={scannerElementId} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Scan result banner */}
        {scanResult && (
          <div
            className="mx-auto rounded-lg px-4 py-3 mb-6 font-semibold"
            style={{
              maxWidth: '350px',
              backgroundColor: statusColors[scanStatus] || '#555',
              color: '#fff',
              fontSize: '16px',
            }}
          >
            {scanResult}
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {/* Start / Stop button */}
        <button
          onClick={isScanning ? stopScanner : startScanner}
          className="px-8 py-3 rounded-lg font-semibold transition-colors"
          style={{
            fontSize: '16px',
            backgroundColor: isScanning ? '#555' : '#890706',
            color: '#fff',
          }}
        >
          {isScanning ? 'Stop Scanner' : 'Start Scanner'}
        </button>
      </section>
    </main>
  );
}

export default QRScanner;
