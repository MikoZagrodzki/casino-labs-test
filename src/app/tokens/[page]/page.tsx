import { Suspense } from 'react';
import TokensTableLoading from '@/app/components/TokensTableLoading';
import TokensTableWrapper from '@/app/components/TokensTableWrapper';

type PageProps = { params: { page: string } };

export default async function Page({ params }: PageProps) {
  // Await params in case they are a Promise
  const { page } = await params;
  const pageNum = Number(page) || 1;
  return (
    <div className='flex flex-col items-center overflow-x-hidden'>
      <header>
        <h1>Welcome to Degen Terminal</h1>
        <p>where finding your next gem is just a click away</p>
      </header>
      <main className='w-full h-full'>
        {/* Loading animation will be rendered while the table is loading */}
        <Suspense fallback={<TokensTableLoading />}>
          {/* This is the main component that will render the table */}
          <TokensTableWrapper page={pageNum} />
        </Suspense>
      </main>
    </div>
  );
}
