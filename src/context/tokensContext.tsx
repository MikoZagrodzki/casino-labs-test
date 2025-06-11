'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Token } from '../types/types';
import { fetchTokens as fetchTokensApi } from '@/lib/fetchTokens';
import { toast } from 'react-hot-toast';

type TokenListContextType = {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  fetchTokens: (page?: number, perPage?: number) => Promise<void>;
};

const TokenListContext = createContext<TokenListContextType>({
  tokens: [],
  setTokens: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  loading: false,
  fetchTokens: async () => {},
});

export function TokenListProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // fetchTokens fetches the tokens from the API
  async function fetchTokens(page: number = 1, perPage: number = 15) {
    setLoading(true);
    let retries = 0;
    let delay = 1200;
    while (retries < 4) {
      try {
        const data = await fetchTokensApi({ page, perPage });
        setTokens(data);
        setCurrentPage(page);
        setLoading(false);
        return;
      } catch (err: unknown) {
        // retries up to 4 times with backoff if rate limited
        const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error';
        if (/429/.test(message) || message.toLowerCase().includes('too many requests')) {
          toast('Rate limited, retrying...', { icon: ' ' });
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
          retries++;
        } else {
          toast.error('Failed to load tokens.');
          setLoading(false);
          return;
        }
      }
    }
    toast.error('Too many requests. Please try again later.');
    setLoading(false);
  }

  return (
    <TokenListContext.Provider
      value={{
        tokens,
        setTokens,
        currentPage,
        setCurrentPage,
        loading,
        fetchTokens,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
}

// useTokenList is the hook to use the context
export function useTokenList() {
  return useContext(TokenListContext);
}
