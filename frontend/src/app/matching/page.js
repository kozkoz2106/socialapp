import Navbar from "@/components/navbar";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import styles from "./page.module.css";

export default async function Matching() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data } = await supabase.from('data').select()

  return (
    <>
      <div className={styles.container}>
          {data.map((item) => (
            <div className={styles.item} key={item.id}>{item.name}</div>
          ))}
      </div>
      <Navbar />
    </>
  )
}