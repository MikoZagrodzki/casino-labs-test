import { useTranslations } from 'next-intl';
import Link from 'next/link';

function BackButton({ currentPage, translationsSouce, page }: { currentPage?: number; translationsSouce: string; page: string }) {
  // Translations
  const t = useTranslations(translationsSouce);
  return (
    <Link
      href={currentPage ? `/${page}/${currentPage}` : '/tokens/1'}
      className='inline-block mt-6 px-4 py-2 bg-black/80 text-white rounded hover:bg-black active:scale-95'
    >
      {t('backToList')}
    </Link>
  );
}

export default BackButton;