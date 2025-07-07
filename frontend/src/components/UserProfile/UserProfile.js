import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('No user ID found. Please log in.');
      setLoading(false);
      return;
    }

    Axios.get(`http://localhost:8080/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, []);

  const updateNavigate = (id) => {
    window.location.href = `/UpdateProfile/${id}`;
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account?'
    );
    if (confirmDelete && user?.id) {
      try {
        await Axios.delete(`http://localhost:8080/user/${user.id}`);
        alert('Account deleted successfully');
        localStorage.removeItem('userId');
        window.location.href = '/Register';
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Profile</h2>
          <p className="text-gray-600">Manage your account details</p>
        </div>

        {loading && <p className="text-gray-600 text-center">Loading...</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {!loading && !error && user && (
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Full Name:</span>
              <span>{user.fullname}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Phone:</span>
              <span>{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Password:</span>
              <span>{user.password}</span>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => updateNavigate(user.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={deleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !user && (
          <p className="text-center text-gray-500">No user data available.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
