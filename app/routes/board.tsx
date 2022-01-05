import { LoaderFunction, useLoaderData, Outlet } from 'remix';
import Header from '~/components/Header'
import { Board } from '~/types'
import { useState } from 'react';

export const loader: LoaderFunction = async () => {
  const response = await fetch('http://localhost:3000/api/boards')
  return await response.json()
}

export default function Index() {
  const data: Board[] = useLoaderData()
  const [isMenuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen max-h-screen flex flex-col">
      <Header boards={data} isMenuOpen={isMenuOpen} setMenuOpen={setMenuOpen} />
      <Outlet />
    </div>
  );
}
