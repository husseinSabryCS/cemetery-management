import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './HomePage.css'; // تأكد من استيراد ملف CSS
import axios from 'axios';

export default function HomePage() {
  const [recentBurials, setRecentBurials] = useState([]);

  useEffect(() => {
    const fetchRecentBurials = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/graves/recentBurials');
        setRecentBurials(response.data);
      } catch (error) {
        console.error('Error fetching recent burials:', error);
      }
    };

    fetchRecentBurials();
  }, []);

  return (
    <>
      <Helmet>
        <meta charset="UTF-8" />
        <meta
          name="description"
          content="هذا الموقع خاص بمدافن أهالي الشوبك الغربي. يتم العمل على تسجيل وتنظيم حالات الوفيات الخاصة بأهالي القرية"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>مقابر الشوبك الغربي</title>
        <link rel="icon" href="/images/Home.svg" />
      </Helmet>
      <div className="home-container">
        <h1>مرحباً بكم في موقع مقابر الشوبك الغربي</h1>
        <h2 style={{ textAlign: 'center' }}>وفيات آخر ثلاث أيام</h2>
        <div className="burials-cards">
          {recentBurials.map((grave) => (
            <div key={grave._id} className="burial-card">
              {grave.buriedPersons.map((person) => (
                <div key={person._id} className="buried-person">
                  <img src="https://via.placeholder.com/60" alt="Avatar" className="avatar" />
                  <div className="person-info">
                    <h3>اسم المتوفى: {person.name}</h3>
                    <p>تاريخ الدفن: {new Date(person.burialDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
