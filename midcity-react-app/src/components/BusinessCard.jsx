function BusinessCard({ business, onClick }) {
  // Parse image URL from Adalo format or use directly
  function getImageUrl(imageData) {
    if (!imageData) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (typeof imageData === 'string') {
      // Try to extract URL from Adalo JSON-like format
      const urlMatch = imageData.match(/'url'\s*:\s*'([^']+)'/);
      if (urlMatch) {
        return `https://drapcode-assets.s3.amazonaws.com/${urlMatch[1]}`;
      }
      // If it's already a URL
      if (imageData.startsWith('http')) return imageData;
      // If it looks like a hash/filename (from import script), add S3 prefix
      if (imageData.includes('.')) {
        return `https://drapcode-assets.s3.amazonaws.com/${imageData}`;
      }
      return imageData;
    }
    if (imageData.url) return imageData.url;
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  return (
    <div
      onClick={() => onClick(business)}
      className="flex-shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-midcity-red transition-all group relative"
      style={{ width: '250px', borderRadius: '6px' }}
    >
      <img
        src={getImageUrl(business.image)}
        alt={business.name}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(business.name);
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
        <h3 className="text-white font-semibold text-sm">{business.name}</h3>
        {business.description && (
          <p className="text-gray-300 text-xs mt-0.5 line-clamp-1">{business.description}</p>
        )}
      </div>
    </div>
  );
}

export default BusinessCard;
