export async function action({ request }: { request: Request }) {
  // console.log(request.headers)
  // console.log(request.body)
  const form = await request.formData()

  console.log(form.get('nick'))
  return null
}