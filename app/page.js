import { redirect } from "next/navigation";

/* Alamat utama "/" dibuka pelanggan -> splash -> menu.
   Admin masuk lewat /login. */
export default function Home() {
  redirect("/splash");
}
