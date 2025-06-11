import { useTranslations } from 'next-intl';
import Image from 'next/image';

function Header() {
  // Translations
  const t = useTranslations('header');
  return (
    <div className='w-full flex flex-row items-center justify-center  py-20 px-2 bg-gradient-to-b from-gray-100 to-white gap-2'>
      <Image src={'/images/logo.png'} alt='logo' width={100} height={100} className='lg:h-[200px]  w-auto' />
      <div className='text-left flex flex-col items-start justify-justify max-w-3xl  lg:gap-2 border-l-2 pl-5'>
        <h1 className='text-xl lg:text-4xl'>
          {t('welcome')} <br className='sm:hidden'/><b>Degen Terminal</b>
        </h1>
        <p className=' lg:text-xl'>{t('subtitle')}</p>
      </div>
    </div>
  );
}

export default Header;
