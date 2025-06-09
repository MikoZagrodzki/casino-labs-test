"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Token } from "../types/types";

type TokenListContextType = {
  tokens: Token[];
  setTokens: React.Dispatch<React.SetStateAction<Token[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

// Make a context with default dummy values for TypeScript
const TokenListContext = createContext<TokenListContextType>({
  tokens: [],
  setTokens: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
});

export function TokenListProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <TokenListContext.Provider
      value={{
        tokens,
        setTokens,
        currentPage,
        setCurrentPage
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
}

// Helper hook for easy use
export function useTokenList() {
  return useContext(TokenListContext);
}
