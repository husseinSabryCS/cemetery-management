import React, { useState } from 'react';
import './Suggestion.css';

export default function Suggestion() {
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(''); // لحفظ رسالة التأكيد أو الخطأ

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, name, phone }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('تم إرسال الاقتراح بنجاح!'); // رسالة نجاح
        // إعادة تعيين الحقول بعد الإرسال
        setText('');
        setName('');
        setPhone('');
      } else {
        setMessage(`خطأ: ${data.message}`); // رسالة خطأ
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setMessage('حدث خطأ أثناء إرسال الاقتراح. يرجى المحاولة مرة أخرى.'); // رسالة خطأ عامة
    }
  };

  return (
    <div className="contact-form">
      <h2>تواصل معنا</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب اقتراحك هنا"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          required
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم الهاتف"
          required
        />
        <button type="submit">إرسال الاقتراح</button>
      </form>
      {message && <p className="feedback-message">{message}</p>} {/* عرض الرسالة */}
    </div>
  );
}

      
    
