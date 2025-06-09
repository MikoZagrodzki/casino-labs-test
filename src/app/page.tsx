import { fetchTokens } from "@/lib/fetchTokens";
import { Token } from "@/types/types";
import TokensTable from "./components/TokensTable";

export default async function Home() {
    const initialTokens: Token[] = await fetchTokens({ page: 1, perPage: 10 }) || [];

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <header> 
        <h1>Welcome to Degen Terminal</h1>
        <p>where finding your next gem is just a click away</p>
      </header>
      <main className="w-full h-full">
      <TokensTable initialTokens={initialTokens} />

      </main>
    </div>
  );
}
