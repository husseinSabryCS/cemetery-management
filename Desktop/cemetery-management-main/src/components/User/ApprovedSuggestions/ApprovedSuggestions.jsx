import React, { useState, useEffect } from 'react';
import './ApprovedSuggestions.css'; // لا تنسى إنشاء هذا الملف للتنسيق

export default function ApprovedSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/suggestion/approved');
        if (!response.ok) {
          throw new Error('Failed to fetch approved suggestions');
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="approved-suggestions">
      <h2>الاقتراحات المعتمدة</h2>
      {loading ? (
        <p>جاري التحميل...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : suggestions.length === 0 ? (
        <p>لا توجد اقتراحات معتمدة.</p>
      ) : (
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion._id} className="suggestion-card">
              <p className="suggestion-text">{suggestion.text}</p>
              <p className="suggestion-submitted">مقدم من: {suggestion.submittedBy}</p>
              <p className="suggestion-date">
                تاريخ الإرسال: {new Date(suggestion.dateSubmitted).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
