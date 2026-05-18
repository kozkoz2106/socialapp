import styles from "./page.module.css";
import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'
import Navbar from "@/components/navbar";

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('data').select()

  return (
    <>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Navbar />
    </>
  )
}