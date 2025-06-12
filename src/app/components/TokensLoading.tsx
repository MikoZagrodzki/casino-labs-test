import { useTranslations } from 'next-intl';
export default function TokensLoading() {
    const t = useTranslations('tokensLoading');

  return (
    <div className='flex flex-col items-center justify-center h-full w-full mt-10'>
      <p>{t('header')}</p>
      <svg className='max-w-1/2' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'>
        <circle
          className='spin2'
          cx='400'
          cy='400'
          fill='none'
          r='200'
          strokeWidth='37'
          stroke='#E387FF'
          strokeDasharray='505 1400'
          strokeLinecap='round'
        />
      </svg>
      <p className='animate-pulse'>{t('info')}</p>
    </div>
  );
}
