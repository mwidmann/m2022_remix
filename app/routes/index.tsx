import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  console.log("Index loader called - redirecting to /board/1");
  throw redirect('/board/1');
}
