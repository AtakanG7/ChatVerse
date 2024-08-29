"use client";

import React from 'react';

const Skeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 bg-gray-300 rounded-full animate-pulse mb-4"></div>
      <div className="w-64 h-8 bg-gray-300 rounded animate-pulse mb-2"></div>
      <div className="w-48 h-8 bg-gray-300 rounded animate-pulse mb-2"></div>
      <div className="w-32 h-8 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
};

export default Skeleton;
