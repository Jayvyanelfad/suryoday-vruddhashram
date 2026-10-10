import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSavedLanguage,
  isSupportedLanguage,
  saveLanguage,
} from '../src/lib/language-preference.js';

test('the language selector persists English, Hindi, and Marathi choices', () => {
  const values = new Map();
  const originalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key) => values.get(key) || null,
      setItem: (key, value) => values.set(key, value),
    },
  });

  try {
    for (const language of ['en', 'hi', 'mr']) {
      assert.equal(isSupportedLanguage(language), true);
      assert.equal(saveLanguage(language), true);
      assert.equal(getSavedLanguage(), language);
    }
    assert.equal(saveLanguage('fr'), false);
    values.set('suryoday-language', 'fr');
    assert.equal(getSavedLanguage(), null);
  } finally {
    if (originalStorage === undefined) delete globalThis.localStorage;
    else Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: originalStorage });
  }
});

test('language persistence tolerates browsers that deny local storage', () => {
  const originalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage access denied.');
    },
  });

  try {
    assert.equal(getSavedLanguage(), null);
    assert.equal(saveLanguage('mr'), false);
  } finally {
    if (originalStorage === undefined) delete globalThis.localStorage;
    else Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: originalStorage });
  }
});
