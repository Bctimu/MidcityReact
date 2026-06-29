import { useState } from 'react';

function Tutorials() {
  const [openSection, setOpenSection] = useState(null);

  const tutorials = [
    {
      id: 'account-deletion',
      title: 'Account Deletion',
      steps: [
        {
          title: 'Step 1: Press the account name located in the side menu',
          description: 'Click on your account name at the bottom of the sidebar.',
        },
        {
          title: 'Step 2: Scroll down until you see Delete Account',
          description: 'On the Account Settings page, scroll down past the profile image section and the Update button.',
        },
        {
          title: 'Step 3: Press Delete Account',
          description: 'Click the "DELETE ACCOUNT" button at the bottom of the page.',
        },
        {
          title: 'Step 4: Confirm deletion',
          description: 'A confirmation dialog will appear asking "Are you sure you want to delete your account? You can\'t undo this." Click "DELETE MY ACCOUNT" to confirm.',
        },
      ],
    },
    {
      id: 'generate-qr',
      title: 'How to Generate Your QR Code',
      steps: [
        {
          title: 'Step 1: Go to the Discount Library',
          description: 'Navigate to the Discount Library page from the sidebar menu.',
        },
        {
          title: 'Step 2: Select a business',
          description: 'Click on any business card to view its discount offer.',
        },
        {
          title: 'Step 3: Click "Generate QR Code"',
          description: 'In the modal that appears, click the large red "GENERATE QR CODE" button.',
        },
        {
          title: 'Step 4: Show your QR code',
          description: 'A QR code will be generated. Show it to the merchant to redeem your discount. The QR code has a time limit, so use it before it expires!',
        },
      ],
    },
  ];

  function toggleSection(id) {
    setOpenSection(openSection === id ? null : id);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-gray-400 text-center text-sm mb-2">F.A.Q.</p>
      <h1 className="text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        Frequently Asked Questions
      </h1>
      <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
        Have a question? Here you'll find the answers most valued by our community, including a picture step-by-step instruction and support.
      </p>

      <hr className="border-gray-700 mb-8" />

      {/* Tutorial sections */}
      <div className="space-y-2">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="border-b border-gray-700">
            <button
              onClick={() => toggleSection(tutorial.id)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400">📖</span>
                <span className="text-white font-semibold">{tutorial.title}</span>
              </div>
              <span className={`text-midcity-red text-xl transition-transform ${openSection === tutorial.id ? 'rotate-45' : ''}`}>
                ●
              </span>
            </button>

            {openSection === tutorial.id && (
              <div className="pb-6 space-y-6">
                {tutorial.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-midcity-card rounded-xl p-6 border border-gray-700"
                  >
                    <h3 className="text-white font-semibold text-center mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm text-center">{step.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Tutorials;
