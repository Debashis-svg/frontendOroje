// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-bold text-blue-500">404</h1>
      <h2 className="text-4xl font-semibold text-white mt-4 mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/">
        <Button variant="primary" className="text-lg px-6 py-3">
          Go to Home
        </Button>
      </Link>
    </div>
  );
}