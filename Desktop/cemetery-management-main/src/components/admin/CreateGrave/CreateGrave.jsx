import React, { useState } from 'react';
import './CreateGrave.css'; // لا تنسى إنشاء هذا الملف للتنسيق

export default function CreateGrave() {
  const [gender, setGender] = useState('');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/graves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gender, number }),
      });

      if (!response.ok) {
        throw new Error('Failed to create grave');
      }

      const data = await response.json();
      setMessage(`Grave created successfully with number: ${data.number}`);
      setGender('');
      setNumber('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="create-grave">
      <h2>إضافة مدفن جديد</h2>
      <form onSubmit={handleSubmit} className="grave-form">
        <div className="form-group">
          <label>الجنس:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">اختر الجنس</option>
            <option value="رجال">رجال</option>
            <option value="نساء">نساء</option>
          </select>
        </div>
        <div className="form-group">
          <label>رقم المدفن:</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            min="1"
            placeholder="ادخل رقم المدفن"
          />
        </div>
        <button type="submit" className="submit-button">
          إضافة
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
