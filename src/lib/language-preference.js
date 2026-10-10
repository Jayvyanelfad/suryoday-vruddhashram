export const SUPPORTED_LANGUAGES = Object.freeze(['en', 'hi', 'mr']);

export function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

export function getSavedLanguage() {
  try {
    const language = globalThis.localStorage?.getItem('suryoday-language');
    return isSupportedLanguage(language) ? language : null;
  } catch {
    return null;
  }
}

export function saveLanguage(language) {
  if (!isSupportedLanguage(language)) return false;
  try {
    globalThis.localStorage?.setItem('suryoday-language', language);
    return true;
  } catch {
    return false;
  }
}
