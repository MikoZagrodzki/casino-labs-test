'use client';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    // Update the locale in a cookie and reload the page
    const newLocale = e.target.value;
    // 1 year expiration
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; 
    window.location.reload();
  }

  return (
    <select onChange={handleChange} defaultValue="">
      <option value="" disabled>Select language</option>
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
  );
}