export type Token = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO date string
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO date string
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string; // ISO date string
  sparkline_in_7d?: null| {
    price: number[];
  };
};


export interface CoinImage {
  thumb: string;
  small: string;
  large: string;
}

export interface CoinDescription {
  en: string;
  [key: string]: string;
}

export interface CoinLinks {
  homepage: string[];
  blockchain_site: string[];
  subreddit_url?: string;
  twitter_screen_name?: string;
[key: string]: string | string[] | undefined}

export interface MarketData {
  current_price: { usd: number; [key: string]: number | undefined };
  market_cap: { usd: number; [key: string]: number | undefined };
  price_change_percentage_24h: number;
  total_supply: number | null;
  circulating_supply: number | null;
  ath: { usd: number; [key: string]: number | undefined };
  ath_date: { usd: string; [key: string]: string | undefined };
  atl: { usd: number; [key: string]: number | undefined };
  atl_date: { usd: string; [key: string]: string | undefined };
  sparkline_7d?: { price: number[] };
[key: string]: number | string | null | undefined | { [k: string]: unknown }}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  image: CoinImage;
  description: CoinDescription;
  links: CoinLinks;
  market_cap_rank?: number;
  market_data: MarketData;
  categories?: string[];
  genesis_date?: string;
  sentiment_votes_up_percentage?: number;
  sentiment_votes_down_percentage?: number;
}

export type TrendingResponse = {
  coins: {
    item: {
      id: string;
      coin_id: number;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      small: string;
      large: string;
      slug: string;
      price_btc: number;
      score: number;
      data?: {
        price: number;
        price_btc: string;
        price_change_percentage_24h?: {
          market_cap?: string;
          market_cap_btc?: string;
          total_volume?: string;
          total_volume_btc?: string;
          sparkline?: string;
          usd: number;
        };
      };
    };
  }[];
};