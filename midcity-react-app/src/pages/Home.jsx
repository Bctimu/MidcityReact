function Home() {
  return (
    <main className="pb-24" style={{ padding: '24px', paddingLeft: '136px' }}>
      {/* Welcome Section */}
      <section className="flex flex-col mb-12">
        {/* Hero image */}
        <div>
          <img
            src="https://image2url.com/r2/default/images/1771293488923-c277d552-3a06-45d7-ac08-4279b269b6bd.avif"
            alt="MidCity aerial view"
            className="object-cover rounded-lg"
            style={{ width: '810px', height: '300px' }}
          />
        </div>

        {/* Welcome text */}
        <h1 className="font-bold mt-8 text-white" style={{ fontSize: '35px' }}>Welcome To MidCity!</h1>
        <p className="text-gray-300 mt-4 leading-relaxed" style={{ fontSize: '20px', maxWidth: '810px' }}>
          MidCity is a vibrant community where neighbors come together to enjoy local
          shopping, dining and entertainment. Designed with charm and connection in mind,
          it's a place where small businesses thrive, residents support each other, and
          there's always something happening just around the corner.
        </p>

        {/* Community image */}
        <div className="mt-10 flex gap-6 items-start" style={{ maxWidth: '810px' }}>
          <img
            src="https://image2url.com/r2/default/images/1771293539472-9671566b-d521-4ce4-96f8-82b1653ddfe2.avif"
            alt="Community event"
            className="object-cover rounded-lg"
            style={{ width: '445px', height: '365px' }}
          />
          <div className="flex-1">
            <h2 className="font-bold text-white whitespace-nowrap" style={{ fontSize: '32px' }}>Your App, Your Advantage</h2>
            <p className="text-gray-300 mt-3 leading-relaxed" style={{ fontSize: '20px' }}>
              We built this app to make the MidCity resident experience even better for you.
              Whether you're grabbing coffee at your favorite local spot or attending a
              weekend market, the app helps you stay connected and save while doing it. With
              exclusive discounts, insider event alerts and community updates all in one place
              — you'll get more out of every day in MidCity. It's convenience, perks and
              community all in the palm of your hand.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
