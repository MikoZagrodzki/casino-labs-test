'use client';
import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Translations
  const t = useTranslations('navbar');

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 left-0 z-40 ">
      <div className="relative mx-auto  flex items-center justify-between px-4 lg:px-10 py-3">
        {/* Logo or App name */}
        <Link href="/" className="font-bold text-lg text-black">
          Degen Terminal
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 border-2 border-gray-300 rounded"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div className={`w-6 h-0.5 bg-gray-700 my-0.5 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-700 my-0.5 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-700 my-0.5 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 ">
          <Link href="/tokens/1" className="hover:text-blue-500">
            {t('tokens')}
          </Link>
          <div className='border-l pl-6 flex items-center gap-1 w-full text-sm '>
            <p className='text-sm'>{t('language')}:</p>
            <LanguageSwitcher />

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 bottom-0 translate-y-full w-full lg:hidden bg-white shadow-md">
          <div className="flex flex-col items-start px-6 py-4 gap-4">
            <Link href="/tokens/1" className="hover:text-blue-500" onClick={() => setMenuOpen(false)}>
              {t('tokens')}
            </Link>
          <div className='flex items-center gap-2 w-full'>
            <p>{t('language')}</p>
            <LanguageSwitcher />

          </div>
          </div>
        </div>
      )}
    </nav>
  );
}