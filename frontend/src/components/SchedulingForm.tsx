import React, { useState } from 'react';

export const SchedulingForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Example of hitting a hypothetical /schedule endpoint
      const res = await fetch('http://127.0.0.1:8000/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time }),
      });
      const data = await res.json();
      alert(`Inspection scheduled! Server response: ${data.message || data}`);
    } catch (error) {
      console.error(error);
      alert('Error scheduling inspection.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Time: </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>
      <button type="submit">Schedule Inspection</button>
    </form>
  );
};