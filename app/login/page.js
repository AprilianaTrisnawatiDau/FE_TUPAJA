"use client";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Field";
import Logo from "@/components/ui/Logo";
import { Modal } from "@/components/ui/Modal";
import { useStore } from "@/lib/store";
export default function LoginPage() {
  const router = useRouter();
  const { admin } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gagal, setGagal] = useState(false);
  const [memuat, setMemuat] = useState(false);
  const [goyang, setGoyang] = useState(0); // dipakai untuk memutar ulang animasi "shake"
  function login(e) {
    e.preventDefault();
    if (memuat) return;
    setMemuat(true);
    // jeda singkat supaya animasi loading terlihat (nanti diganti panggilan API)
    setTimeout(() => {
      if (username.trim().toLowerCase() === admin.username && password === admin.password) {
        router.push("/admin");
      } else {
        setMemuat(false);
        setGoyang((g) => g + 1);
        setGagal(true);
      }
    }, 600);
  }
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 pb-[8vh]">
      <div className="anim-fade-up">
        <div className="anim-float">
          <Logo />
        </div>
      </div>
      <form
        key={goyang}
        onSubmit={login}
        className={`stagger mt-10 w-full max-w-[300px] space-y-5 ${goyang ? "anim-shake" : ""}`}
      >
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button type="submit" className="mt-3 w-full py-2.5" disabled={memuat}>
          {memuat ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Memeriksa...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <Modal open={gagal} onClose={() => setGagal(false)} className="max-w-[230px] px-4 py-4 text-center">
        <CircleAlert className="anim-wiggle mx-auto h-9 w-9 text-merah" strokeWidth={2} />
        <h3 className="mt-1 text-[12px] font-bold">Login Gagal!</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-gray-600">
          Username atau password yang anda masukkan salah.
        </p>
        <Button variant="abu" className="mt-3 px-5 py-1 text-[10px]" onClick={() => setGagal(false)}>
          Kembali
        </Button>
      </Modal>
    </main>
  );
}
