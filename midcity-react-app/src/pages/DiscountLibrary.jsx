import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import BusinessCard from '../components/BusinessCard';
import Modal from '../components/Modal';

function DiscountLibrary() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [eatBusinesses, setEatBusinesses] = useState([]);
  const [drinkBusinesses, setDrinkBusinesses] = useState([]);
  const [entertainmentBusinesses, setEntertainmentBusinesses] = useState([]);
  const [stayBusinesses, setStayBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const [eatSnap, drinksSnap, entertainSnap, staySnap] = await Promise.all([
          getDocs(collection(db, 'eat')),
          getDocs(collection(db, 'drinks')),
          getDocs(collection(db, 'entertainment')),
          getDocs(collection(db, 'stay')).catch(() => ({ docs: [] })),
        ]);

        setEatBusinesses(eatSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setDrinkBusinesses(drinksSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setEntertainmentBusinesses(entertainSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setStayBusinesses(staySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError(err.message || 'Failed to load businesses');
      }
      setLoading(false);
    }
    fetchBusinesses();
  }, []);

  return (
    <main className="pb-24" style={{ padding: '24px', paddingLeft: '20px' }}>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <>
          {/* Grab a Bite */}
          {eatBusinesses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Grab a Bite</h2>
              <div className="scroll-container">
                {eatBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    onClick={setSelectedBusiness}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Drinks */}
          {drinkBusinesses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Drinks</h2>
              <div className="scroll-container">
                {drinkBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    onClick={setSelectedBusiness}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Entertainment */}
          {entertainmentBusinesses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Entertainment</h2>
              <div className="scroll-container">
                {entertainmentBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    onClick={setSelectedBusiness}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Enjoy Your Stay */}
          {stayBusinesses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-white text-xl font-bold mb-4">Enjoy Your Stay</h2>
              <div className="scroll-container">
                {stayBusinesses.map((biz) => (
                  <BusinessCard
                    key={biz.id}
                    business={biz}
                    onClick={setSelectedBusiness}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Error loading businesses:</p>
              <p className="text-sm mt-1">{error}</p>
              {error.includes('permission') && (
                <p className="text-sm mt-2">
                  Fix: Go to Firebase Console &gt; Firestore &gt; Rules and set:
                  <code className="block bg-black/30 p-2 rounded mt-1 text-xs">
                    {`allow read: if request.auth != null;`}
                  </code>
                </p>
              )}
            </div>
          )}

          {/* Empty state */}
          {!error && eatBusinesses.length === 0 && drinkBusinesses.length === 0 && entertainmentBusinesses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No businesses found.</p>
              <p className="text-gray-500 text-sm mt-2">Run the import script to load business data.</p>
            </div>
          )}
        </>
      )}

      {/* Business Modal */}
      <Modal business={selectedBusiness} onClose={() => setSelectedBusiness(null)} />
    </main>
  );
}

export default DiscountLibrary;
