import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-8xl font-bold text-red-500">404</h1>
      <p className="text-2xl text-gray-700">Page Not Found</p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
