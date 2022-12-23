import { type LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return redirect('/board/1')
}
