'use client';
import { useEffect, useMemo, useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
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
        className="flex items-center gap-2 rounded-full border border-[#d6e5df] bg-white/90 px-3 py-2 text-sm font-medium text-[#163d32] shadow-sm backdrop-blur-sm transition hover:bg-white"
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="language-options"
      >
        <Globe className="hidden h-4 w-4 min-[400px]:block" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.name}</span>
      </button>

      {open && (
        <div id="language-options" role="menu" aria-label="Available languages" onKeyDown={handleMenuKeyDown} className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-[#d6e5df] bg-white shadow-xl">
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
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${
                currentLanguage === language.code ? 'bg-[#edf7f3] text-[#163d32]' : 'text-[#282b28] hover:bg-[#f5f5f0]'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
