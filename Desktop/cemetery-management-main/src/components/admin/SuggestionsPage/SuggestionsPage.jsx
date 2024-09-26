import React, { useEffect, useState } from 'react';
import './SuggestionsPage.css'; // لا تنسى التأكد من وجود ملف CSS للتنسيق

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('pending'); // الحالة الافتراضية للعرض

  // جلب الاقتراحات بناءً على الحالة عند تحميل الصفحة أو عند تغيير الحالة
  useEffect(() => {
    fetchSuggestionsByStatus(status);
  }, [status]);

  // جلب الاقتراحات بناءً على الحالة
  const fetchSuggestionsByStatus = async (status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/suggestion/status/${status}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      setError('Error fetching suggestions by status');
    }
  };

  // تحديث حالة الاقتراح إلى "approved" أو "rejected"
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/suggestion/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update suggestion status');
      }

      // تحديث الاقتراحات في الواجهة بعد تغيير الحالة
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((suggestion) =>
          suggestion._id === id ? { ...suggestion, status: newStatus } : suggestion
        )
      );
    } catch (error) {
      setError('Error updating suggestion status');
    }
  };

  // تحويل الحالة من الإنجليزية للعربية
  const getStatusInArabic = (status) => {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  return (
    <div className="suggestions-page">
      <h2>الاقتراحات</h2>
      {error && <p className="error-message">{error}</p>}
      
      {/* قائمة اختيار الحالة */}
      <div className="status-filter">
        <label htmlFor="status">اختر الحالة:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">قيد الانتظار</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      <ul className="suggestions-list">
        {suggestions.map((suggestion) => (
          <li key={suggestion._id} className="suggestion-item">
            <p><strong>الاقتراح:</strong> {suggestion.text}</p>
            <p><strong>من:</strong> {suggestion.submittedBy || suggestion.name}</p>
            <p><strong>الحالة:</strong> {getStatusInArabic(suggestion.status)}</p>
            <div className="button-group">
              {suggestion.status === 'pending' && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => updateStatus(suggestion._id, 'approved')}
                  >
                    قبول
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => updateStatus(suggestion._id, 'rejected')}
                  >
                    رفض
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
