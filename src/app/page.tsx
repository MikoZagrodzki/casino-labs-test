import { fetchTokens } from '@/lib/fetchTokens';
import { Token } from '@/types/types';
import TokensTable from './components/TokensTable';
import { Suspense } from 'react';
import TokensTableLoading from './components/TokensTableLoading';
import TokensTableWrapper from './components/TokensTableWrapper';

export default async function Home() {

  return (
    <div className='flex flex-col items-center overflow-x-hidden'>
      <header>
        <h1>Welcome to Degen Terminal</h1>
        <p>where finding your next gem is just a click away</p>
      </header>
      <main className='w-full h-full'>
        <Suspense fallback={<TokensTableLoading />}>
          <TokensTableWrapper />
          {/* <TokensTableLoading /> */}
        </Suspense>
      </main>
    </div>
  );
}
