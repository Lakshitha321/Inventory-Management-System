import React from 'react';

function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      <div className="relative z-10 bg-white p-10 rounded-lg shadow-lg text-center space-y-4 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome</h1>

        <button
          onClick={() => (window.location.href = '/additem')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add Item
        </button>

        <button
          onClick={() => (window.location.href = '/allitems')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          All Items
        </button>

        <button
          onClick={() => (window.location.href = '/Register')}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <button
          onClick={() => (window.location.href = '/Login')}
          className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;
