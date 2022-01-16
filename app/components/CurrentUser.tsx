import { useContext } from "react"
import { Form } from "remix"
import { AppContext } from "~/context/AppContext"
export default function CurrentUser({ user }: { user: { [key: string]: string } }) {
  const { pms } = useContext(AppContext)
  return (
    <div>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <p>Eingeloggt als <span className="font-bold">{user.username}</span></p>
      <p>Du hast {pms} PMs.</p>
      <Form method="post" className="mt-4">
        <input type="hidden" name="_action" value="logout" />
        <button type="submit" className="action-button">Abmelden</button>
      </Form>
    </div>
  )
}