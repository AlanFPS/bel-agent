import React, { useState } from 'react';

interface ResidentFormData {
  bedrooms: number;
  bathrooms: number;
  city: string;
  budget?: number;
}

export const ResidentFlow: React.FC = () => {
  const [formData, setFormData] = useState<ResidentFormData>({
    bedrooms: 0,
    bathrooms: 0,
    city: '',
    budget: undefined,
  });
  const [showListings, setShowListings] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'budget' ? parseInt(value, 10) : parseInt(value, 10) || value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowListings(true);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Resident Flow</h2>
      {!showListings ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Bedrooms:</label>
            <input
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Bathrooms:</label>
            <input
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>City/Area:</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Budget (Optional):</label>
            <input
              name="budget"
              type="number"
              value={formData.budget || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Search Homes</button>
        </form>
      ) : (
        <ResidentHomeListings {...formData} />
      )}
    </div>
  );
};

interface ListingProps extends ResidentFormData {}

const mockListings = [
  { id: 1, title: 'Cozy Cottage', bedrooms: 2, bathrooms: 1, city: 'San Jose', price: 2000 },
  { id: 2, title: 'Modern Townhouse', bedrooms: 3, bathrooms: 2, city: 'San Jose', price: 2800 },
  { id: 3, title: 'Downtown Condo', bedrooms: 2, bathrooms: 2, city: 'San Francisco', price: 3200 },
];

const ResidentHomeListings: React.FC<ListingProps> = (props) => {
  const [selectedListing, setSelectedListing] = useState<any>(null);

  const filtered = mockListings.filter((home) => {
    if (home.bedrooms < props.bedrooms) return false;
    if (home.bathrooms < props.bathrooms) return false;
    if (props.city && home.city.toLowerCase() !== props.city.toLowerCase()) return false;
    if (props.budget && home.price > props.budget) return false;
    return true;
  });

  const scheduleTour = (homeId: number) => {
    alert(`Scheduling a tour for home ID = ${homeId}`);
    // Call a /scheduleTour endpoint here if needed
  };

  return (
    <div>
      <h3>Matching Homes</h3>
      {filtered.length === 0 && <p>No matching listings found.</p>}
      {filtered.map((home) => (
        <div key={home.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <h4>{home.title}</h4>
          <p>
            {home.bedrooms} bed / {home.bathrooms} bath in {home.city}
          </p>
          <p>Price: ${home.price}</p>
          <button onClick={() => setSelectedListing(home)}>View More</button>
        </div>
      ))}
      {selectedListing && (
        <div style={{ marginTop: 20, background: '#f7f7f7', padding: 10 }}>
          <h4>More Details</h4>
          <p>{selectedListing.title}</p>
          <p>
            {selectedListing.bedrooms} bed / {selectedListing.bathrooms} bath
          </p>
          <p>City: {selectedListing.city}</p>
          <p>Price: ${selectedListing.price}</p>
          <button onClick={() => scheduleTour(selectedListing.id)}>Schedule Tour</button>
        </div>
      )}
    </div>
  );
};