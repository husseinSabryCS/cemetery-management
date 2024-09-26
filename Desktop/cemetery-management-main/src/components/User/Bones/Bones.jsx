import React, { useEffect, useState } from 'react';
import '../Woman/Woman.css'; // Make sure to create and link the CSS file

export default function Bones() {
  const [graves, setGraves] = useState([]);

  useEffect(() => {
    const fetchGraves = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/graves/bone');
        const data = await response.json();
        setGraves(data);
      } catch (error) {
        console.error('Error fetching bone graves:', error);
      }
    };
    fetchGraves();
  }, []);

  return (
    <div className="woman-container">
      {graves.map((grave) => (
        <div
          key={grave._id}
          className={`grave-card ${grave.status === 'متاحة' ? 'available' : 'not-available'}`}
        >
          <h2>رقم المقبرة: {grave.number}</h2>
          <p>الحالة: {grave.status}</p>
          <p>
            متاح بعد:{" "}
            {grave.status === 'متاحة'
              ? 'الآن' // If the status is "متاحة", show "الآن"
              : `${grave.daysUntilAvailable} يوم` // Show daysUntilAvailable for not available graves
            }
          </p>
          <button className="show-more-btn">عرض المزيد</button>
        </div>
      ))}
    </div>
  );
}
