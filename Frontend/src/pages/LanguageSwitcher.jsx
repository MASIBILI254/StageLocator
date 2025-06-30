import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang);
  };

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={handleChange}
        className="language-dropdown"
      >
        <option value="en">en English</option>
        <option value="sw">sw Kiswahili</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
