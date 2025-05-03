
import React from 'react';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Illusia ry</h1>
      <p className="text-lg mb-6">
        Illusia ry provides game and event organizers across Finland with a user-friendly booking
        system for shared storage items. Explore our platform to reserve the resources you need.
      </p>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p className="mb-2">
          <strong>Address:</strong> Pasilankatu 8, 00240 Helsinki, Finland
        </p>
        <p className="mb-2">
          <strong>Email:</strong> <a href="mailto:info@illusiary.fi" className="text-blue-600 hover:underline">info@illusiary.fi</a>
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> +358 50 123 4567
        </p>
        <p className="mb-2">
          <strong>Office Hours:</strong> Mon–Fri, 10:00–16:00
        </p>
      </div>
    </div>
  );
};

export default HomePage;
