import React from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    fullname: '',
    email: '',
    password: '',
    phone: ''
  });

  const { fullname, email, password, phone } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await Axios.post('http://localhost:8080/user', user);
    alert('User registered successfully');
    navigate('/Login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-4">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h1>

        <label htmlFor="fullname" className="block font-medium text-blue-700">Full Name</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          onChange={onInputChange}
          value={fullname}
          required
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <label htmlFor="email" className="block font-medium text-blue-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={onInputChange}
          value={email}
          required
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <label htmlFor="password" className="block font-medium text-blue-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={onInputChange}
          value={password}
          required
          className="w-full border px-4 py-2 rounded mb-4"
        />

        <label htmlFor="phone" className="block font-medium text-blue-700">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          onChange={onInputChange}
          value={phone}
          required
          className="w-full border px-4 py-2 rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;