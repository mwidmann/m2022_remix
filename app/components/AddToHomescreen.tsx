import { useEffect, useState } from 'react'
export default function AddToHomescreen() {
  const [enabled, setEnabled] = useState<boolean>(false)
  useEffect(() => {}, [])

  if (!enabled) return null

  return <div></div>
}
