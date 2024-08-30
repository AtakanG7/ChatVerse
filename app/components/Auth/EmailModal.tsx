import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailModal = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      onSubmit(email);
    } else {
      toast.error('Please enter a valid email address', {
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-[#2f3136] p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-white text-2xl font-semibold mb-4">Enter Your Email</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-[#202225] text-white border border-[#4f545c] rounded focus:outline-none focus:ring-2 focus:ring-[#7289da]"
          placeholder="you@example.com"
          title="Please enter a valid email address"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-[#5865f2] text-white px-4 py-2 rounded hover:bg-[#4752c4] transition duration-200 focus:outline-none"
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmailModal;

