import React, { useState } from 'react';

interface HomeownerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  isVacant: boolean;
  utilitiesOn: boolean;
}

export const HomeownerFlow: React.FC = () => {
  const [formData, setFormData] = useState<HomeownerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    isVacant: false,
    utilitiesOn: false,
  });
  const [isScheduled, setIsScheduled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.isVacant && formData.utilitiesOn) {
      // Show scheduling form or directly schedule
      setIsScheduled(true);
    } else {
      alert('Thanks! We’ll follow up for more info or next steps.');
    }
  };

  const scheduleInspection = async () => {
    try {
      // Hard-coded schedule data for example:
      const response = await fetch('http://localhost:5173/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: '2025-12-01', time: '10:00' }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Inspection scheduled and communication triggered!');
      }
    } catch (error) {
      console.error(error);
      alert('Error scheduling inspection.');
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Homeowner Flow</h2>
      {!isScheduled ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Home Address:</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>
              <input
                name="isVacant"
                type="checkbox"
                checked={formData.isVacant}
                onChange={handleChange}
              />
              Home is vacant
            </label>
          </div>
          <div>
            <label>
              <input
                name="utilitiesOn"
                type="checkbox"
                checked={formData.utilitiesOn}
                onChange={handleChange}
              />
              Utilities are on
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div>
          <h3>Schedule Inspection</h3>
          <p>Click to schedule an inspection for 2025-12-01 at 10:00</p>
          <button onClick={scheduleInspection}>Confirm Scheduling</button>
        </div>
      )}
    </div>
  );
};