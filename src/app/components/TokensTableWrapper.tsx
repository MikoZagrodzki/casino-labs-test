import { fetchTokens } from "@/lib/fetchTokens";
import { Token } from "@/types/types";
import TokensTable from "./TokensTable";

export default async function TokensTableWrapper() {
  let initialTokens: Token[] = [];
  try {
    initialTokens = await fetchTokens({ page: 1, perPage: 15 });
  } catch (error: any) {
    if (error.message.includes("Too many requests")) {

      return (
        <div className="text-center text-red-500 py-6">
          <p>Too many requests (rate limit). Please wait and try again.</p>
        </div>
      );
    }

    return (
      <div className="text-center text-red-500 py-6">
        Failed to load tokens. Please try again.
      </div>
    );
  }

  return <TokensTable initialTokens={initialTokens} />;
}
