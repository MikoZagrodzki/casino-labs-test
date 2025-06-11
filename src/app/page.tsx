import { redirect } from "next/navigation";


export default async function Home() {
  // Redirect to the first page of tokens
  redirect("/tokens/1")


}
