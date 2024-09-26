import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // تأكد من إنشاء ملف CSS للتصميم

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      // حفظ التوكن في التخزين المحلي أو أي مكان آخر
      localStorage.setItem('token', response.data.token);
      alert('تم تسجيل الدخول بنجاح!');
      // يمكنك توجيه المستخدم إلى الصفحة الرئيسية أو صفحة أخرى
    } catch (error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل دخول</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>كلمة المرور:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
}
