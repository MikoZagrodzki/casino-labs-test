'use client';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const [selectedLocale, setSelectedLocale] = useState('en');

  useEffect(() => {
    // Read locale from cookies on mount
    const cookieMatch = document.cookie.match(/locale=([a-zA-Z-]+)/);
    if (cookieMatch) {
      setSelectedLocale(cookieMatch[1]);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value;
    setSelectedLocale(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  }

  return (
    <select className='text-left' onChange={handleChange} value={selectedLocale}>
      <option value="" disabled>Select language</option>
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
  );
}