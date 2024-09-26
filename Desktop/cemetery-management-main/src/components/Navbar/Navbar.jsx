import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/logo.png';

export default function Navbar() {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="head-p">
          <img className="logo" src={logo} alt="Logo" />
          <p>
              <span>مقابر</span><sub>أهالي الشوبك الغربي</sub>
            </p>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <div className="links">
            <ul>
              <li>
                <Link to="/home" className="disnone home" title="الرئيسية">
                <FontAwesomeIcon icon={faHome} />
                </Link>
                <Link to="/home" className="toggle active" title="الرئيسية">الرئيسية</Link>
              </li>
              <li><Link to="/man" title="الرجال">الرجال</Link></li>
              <li><Link to="/woman" title="النساء">النساء</Link></li>
              <li><Link to="/bones" title="العظام">العظام</Link></li>
              <li><Link to="/suggest" title="اقتراحك">اقتراحك</Link></li>
              <li><Link to="/contact" title="تواصل معنا">تواصل معنا</Link></li>
              <li><Link to="/ApprovedSuggestions" title="الاقتراحات المعتمدة">الاقتراحات المعتمدة</Link></li>
              <li><Link to="/login" title="تسجيل الدخول">تسجيل الدخول</Link></li>
              <li><Link to="/CreateGrave" title="انشاء مقبرة">انشاء مقبرة</Link></li>
              <li><Link to="/RegisterPage" title="انشاء ادمن">انشاء ادمن</Link></li>
              <li><Link to="/SuggestionsPage" title="ادارة الاقتراحات">ادارة الاقتراحات</Link></li>
            </ul>
          </div>
          <input type="text" id="sreech" placeholder="إبحث في الموقع" />
          <div className="sreech">
            <i className="fas fa-search toggle-sreech" title="بحث"></i>
          </div>
        </div>
      </nav>
    </>
  );
}
