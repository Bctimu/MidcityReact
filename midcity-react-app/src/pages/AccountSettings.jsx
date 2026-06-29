import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function AccountSettings() {
  const { currentUser, userData, updateProfile, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(userData?.fullName || '');
  const [email, setEmail] = useState(userData?.email || currentUser?.email || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = profileImage;

      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateProfile({
        fullName,
        profileImage: imageUrl,
      });

      setProfileImage(imageUrl);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile: ' + err.message);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      setMessage('Error deleting account: ' + err.message);
      setShowDeleteModal(false);
    }
    setDeleteLoading(false);
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Account Settings
        </h1>
        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Name display */}
        <h2 className="text-center text-white text-xl font-bold mb-6">{fullName || 'User'}</h2>

        {message && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-500/20 text-red-300 border border-red-500' : 'bg-green-500/20 text-green-300 border border-green-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-midcity-red"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Profile Image */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-1">Profile Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 bg-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors"
            >
              {profileImage ? (
                <img src={profileImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-midcity-red font-medium">Choose Photo</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Update button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-midcity-red text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'UPDATE'}
          </button>
        </form>

        {/* Sign Out */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-lg mb-3">Time to go?</p>
          <button
            onClick={handleLogout}
            className="w-full border border-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            SIGN OUT
          </button>
        </div>

        {/* Delete Account */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-midcity-red font-semibold hover:underline"
          >
            DELETE ACCOUNT
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="bg-midcity-card rounded-xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
            <h2 className="text-white text-xl font-bold text-center mb-2">Delete Account?</h2>
            <p className="text-gray-400 text-center text-sm mb-6">
              Are you sure you want to delete your account? You can't undo this.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="w-full bg-midcity-red text-white py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors disabled:opacity-50 mb-3"
            >
              {deleteLoading ? 'Deleting...' : 'DELETE MY ACCOUNT'}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="w-full border border-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
