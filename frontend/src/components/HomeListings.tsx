import React, { useState } from 'react';

interface HomeOption {
  id: number;
  title: string;
  bedrooms: number;
  bathrooms: number;
  city: string;
  price: number;
}

const mockListings: HomeOption[] = [
  { id: 1, title: 'Cozy Cottage', bedrooms: 2, bathrooms: 1, city: 'San Jose', price: 2000 },
  { id: 2, title: 'Modern Townhouse', bedrooms: 3, bathrooms: 2, city: 'San Jose', price: 2800 },
  { id: 3, title: 'Downtown Condo', bedrooms: 2, bathrooms: 2, city: 'San Francisco', price: 3200 },
];

export const HomeListings: React.FC = () => {
  const [selectedHome, setSelectedHome] = useState<HomeOption | null>(null);

  const handleSelectHome = (home: HomeOption) => {
    setSelectedHome(home);
  };

  const handleScheduleTour = () => {
    if (!selectedHome) return;
    alert(`Scheduling a tour for: ${selectedHome.title}`);
    // Insert actual scheduling code or a fetch() call
  };

  return (
    <div>
      <h3>Matching Homes</h3>
      <ul>
        {mockListings.map((home) => (
          <li key={home.id} style={{ marginBottom: 10 }}>
            <strong>{home.title}</strong>
            <p>{home.bedrooms} bed / {home.bathrooms} bath</p>
            <p>{home.city}</p>
            <p>Price: ${home.price}</p>
            <button onClick={() => handleSelectHome(home)}>View Details</button>
          </li>
        ))}
      </ul>

      {selectedHome && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <h4>{selectedHome.title}</h4>
          <p>
            {selectedHome.bedrooms} bed / {selectedHome.bathrooms} bath
          </p>
          <p>Location: {selectedHome.city}</p>
          <p>Price: ${selectedHome.price}</p>
          <button onClick={handleScheduleTour}>Schedule a Tour</button>
        </div>
      )}
    </div>
  );
};