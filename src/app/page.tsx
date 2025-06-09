import { fetchTokens } from "@/lib/fetchTokens";
import { Token } from "@/types/types";

export default async function Home() {
    const initialTokens: Token[] = await fetchTokens({ page: 1, perPage: 10 }) || [];
  console.log("Fetched tokens:", initialTokens);
  return (
    <div className="">
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-8">Token List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialTokens&&initialTokens.map((token) => (
            <div key={token.id} className="p-4 border rounded-lg shadow-md">
              <img src={token.image} alt={token.name} className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-semibold">{token.name} ({token.symbol.toUpperCase()})</h2>
              <p>Current Price: ${token.current_price}</p>
              <p>Market Cap: ${token.market_cap}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

