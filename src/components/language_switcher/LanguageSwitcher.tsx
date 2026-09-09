import React from 'react';
import { useTranslation } from 'react-i18next';
import type { LanguageSwitcherProps } from '../../types';
import './LanguageSwitcher.css';

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  const handleLanguageChange = (lang: 'es' | 'en') => {
    if (currentLang !== lang) {
      i18n.changeLanguage(lang);
    }
  };

  return (
    <div
      className={`lang-switcher-container ${variant} ${className}`}
      role="group"
      aria-label={t('common.language', 'Idioma / Language')}
    >
      <div className="lang-switcher-track">
        <button
          type="button"
          className={`lang-btn ${currentLang === 'es' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('es')}
          aria-pressed={currentLang === 'es'}
          title={t('common.spanish', 'Español')}
        >
          <span className="lang-flag" aria-hidden="true">🇦🇷</span>
          <span className="lang-code">ARS</span>
        </button>

        <span className="lang-divider" aria-hidden="true">|</span>

        <button
          type="button"
          className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
          onClick={() => handleLanguageChange('en')}
          aria-pressed={currentLang === 'en'}
          title={t('common.english', 'English')}
        >
          <span className="lang-flag" aria-hidden="true">🇺🇸</span>
          <span className="lang-code">USD</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
