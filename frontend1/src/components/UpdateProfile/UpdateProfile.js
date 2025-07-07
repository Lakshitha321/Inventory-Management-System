import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';

function UpdateProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/user/${id}`);
        const itemData = response.data;
        setFormData({
          fullname: itemData.fullname || '',
          email: itemData.email || '',
          password: itemData.password || '',
          phone: itemData.phone || '',
        });
      } catch (error) {
        setError('Failed to load user data');
      }
    };
    fetchUserData();
  }, [id]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await Axios.put(`http://localhost:8080/user/${id}`, formData);
      setSuccess('Profile updated successfully');
      setTimeout(() => navigate('/UserProfile'), 1500);
    } catch (error) {
      setError('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Profile</h1>
          <p className="text-gray-600">Edit your information below</p>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={onInputChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
