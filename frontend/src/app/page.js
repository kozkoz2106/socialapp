import Navbar from "@/components/navbar";
import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";
import ProfileEditor from "./profile-editor";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from("data").select();

  return (
    <>
      <ProfileEditor initialData={data ?? []} />
      <Navbar />
    </>
  );
}