import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function Analytics() {
  const { currentUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userNames, setUserNames] = useState({});

  // Check if current user is an admin
  useEffect(() => {
    if (!currentUser) return;
    async function checkAdmin() {
      const adminDoc = await getDoc(doc(db, 'midcityAdmins', currentUser.uid));
      setIsAdmin(adminDoc.exists());
    }
    checkAdmin();
  }, [currentUser]);

  // Listen to scans in real-time
  useEffect(() => {
    if (!currentUser) return;

    let q;
    if (isAdmin) {
      q = query(collection(db, 'scans'));
    } else {
      q = query(collection(db, 'scans'), where('scannedBy', '==', currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const scanData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Collect unique user IDs to resolve names
      const userIds = new Set();
      scanData.forEach((scan) => {
        if (scan.scannedBy) userIds.add(scan.scannedBy);
        if (scan.originalUserId) userIds.add(scan.originalUserId);
      });

      // Fetch names for any IDs we don't already have
      const newNames = { ...userNames };
      const fetchPromises = [];
      userIds.forEach((uid) => {
        if (!newNames[uid]) {
          fetchPromises.push(
            getDoc(doc(db, 'users', uid)).then((userDoc) => {
              if (userDoc.exists()) {
                const data = userDoc.data();
                newNames[uid] = data.businessName || data.fullName || data.email || uid;
              } else {
                newNames[uid] = uid;
              }
            })
          );
        }
      });

      await Promise.all(fetchPromises);
      setUserNames(newNames);
      setScans(scanData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, isAdmin]);

  function formatDate(timestamp) {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  }

  function exportCSV() {
    const headers = ['Scanned By', 'Resident', 'Token', 'Scanned At'];
    const rows = scans.map((scan) => [
      userNames[scan.scannedBy] || scan.scannedBy,
      userNames[scan.originalUserId] || scan.originalUserId,
      scan.token,
      formatDate(scan.scannedAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `midcity-scans-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="pb-24" style={{ padding: '24px', paddingLeft: '20px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold" style={{ fontSize: '28px' }}>
            {isAdmin ? 'Admin Analytics' : 'Scan Analytics'}
          </h1>
          <p className="text-gray-400 mt-1" style={{ fontSize: '14px' }}>
            {isAdmin
              ? 'Viewing all scans across all merchants'
              : 'Viewing your scan history'}
          </p>
        </div>
        {scans.length > 0 && (
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{ backgroundColor: '#890706', color: '#fff' }}
          >
            Export CSV
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="flex gap-4 mb-8">
        <div className="rounded-xl p-4 flex-1" style={{ backgroundColor: '#2a2a2a' }}>
          <p className="text-gray-400 text-sm">Total Scans</p>
          <p className="text-white font-bold" style={{ fontSize: '32px' }}>
            {scans.length}
          </p>
        </div>
        <div className="rounded-xl p-4 flex-1" style={{ backgroundColor: '#2a2a2a' }}>
          <p className="text-gray-400 text-sm">Unique Residents</p>
          <p className="text-white font-bold" style={{ fontSize: '32px' }}>
            {new Set(scans.map((s) => s.originalUserId)).size}
          </p>
        </div>
        <div className="rounded-xl p-4 flex-1" style={{ backgroundColor: '#2a2a2a' }}>
          <p className="text-gray-400 text-sm">Today</p>
          <p className="text-white font-bold" style={{ fontSize: '32px' }}>
            {scans.filter((s) => {
              if (!s.scannedAt) return false;
              const d = s.scannedAt.toDate ? s.scannedAt.toDate() : new Date(s.scannedAt);
              const today = new Date();
              return d.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* Scans table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : scans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No scans recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: '#2a2a2a' }}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3a3a' }}>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Scanned By</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Resident</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Token</th>
                <th className="px-4 py-3 text-gray-400 text-sm font-medium">Scanned At</th>
              </tr>
            </thead>
            <tbody>
              {scans
                .sort((a, b) => {
                  const aTime = a.scannedAt?.toMillis?.() || 0;
                  const bTime = b.scannedAt?.toMillis?.() || 0;
                  return bTime - aTime;
                })
                .map((scan) => (
                  <tr
                    key={scan.id}
                    style={{ borderBottom: '1px solid #3a3a3a' }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-white text-sm">
                      {userNames[scan.scannedBy] || scan.scannedBy}
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      {userNames[scan.originalUserId] || scan.originalUserId}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {scan.token ? `${scan.token.substring(0, 12)}...` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {formatDate(scan.scannedAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Analytics;
