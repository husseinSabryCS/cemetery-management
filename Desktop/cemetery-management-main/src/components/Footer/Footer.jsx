import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <div className='footer'>
      <div className='footer-content'>
        <h4>حسين صبري السنوطي</h4>
        <p>
          البريد الإلكتروني:{' '}
          <a href="mailto:sabryhusseinhussein@gmail.com">
            sabryhusseinhussein@gmail.com
          </a>
        </p>
        <p>رقم الهاتف: 01096586823</p>
        <p>مطور باك اند و تيستر</p>
        <p>تصميم UI: رضا عبد الواحد</p>
        <p>رقم المصمم: +02 01554528592</p>
        <p>مشاركين في الفرونت اند:</p>
        <ul>
          <li>جهاد محمد</li>
          <li>شعبان عبدالباسط</li>
        </ul>
      </div>
    </div>
  );
}
