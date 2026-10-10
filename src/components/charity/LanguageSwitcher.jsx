'use client';
import { useEffect, useMemo, useState } from 'react';

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'hi', name: 'Hindi', short: 'हिं' },
  { code: 'mr', name: 'Marathi', short: 'मर' },
];

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const currentLang = useMemo(
    () => languages.find((language) => language.code === currentLanguage) || languages[0],
    [currentLanguage]
  );

  useEffect(() => {
    document.documentElement.lang = currentLanguage || 'en';
  }, [currentLanguage]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  function handleMenuKeyDown(event) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const options = Array.from(event.currentTarget.querySelectorAll('button[role="menuitemradio"]'));
    const currentIndex = options.indexOf(document.activeElement);
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + direction + options.length) % options.length;
    event.preventDefault();
    options[nextIndex]?.focus();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="language-trigger"
        aria-label={`Language: ${currentLang.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="language-options"
      >
        <span aria-hidden="true" className="language-short">{currentLang.short}</span>
        <span className="language-name">{currentLang.name}</span>
      </button>

      {open && (
        <div id="language-options" role="menu" aria-label="Available languages" onKeyDown={handleMenuKeyDown} className="language-menu absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="menuitemradio"
              aria-checked={currentLanguage === language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setOpen(false);
              }}
              className={`language-option flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                currentLanguage === language.code ? 'is-selected' : ''
              }`}
            >
              <span className="language-short">{language.short}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
