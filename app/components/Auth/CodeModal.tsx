"use client";

import React, { useState } from 'react';

const CodeModal = ({ onSubmit }: { onSubmit: (code: string) => void }) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit(code);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Enter the code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default CodeModal;
