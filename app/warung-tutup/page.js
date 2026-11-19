"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStatusWarung } from "../../lib/statusWarung";
import styles from "./warung-tutup.module.css";

export default function WarungTutupPage() {
  const router = useRouter();
  const { buka } = useStatusWarung();

  // Begitu admin menekan "Buka Warung", pelanggan otomatis kembali ke menu
  useEffect(() => {
    if (buka) router.replace("/home");
  }, [buka, router]);

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.splashScreen}>
          <div className={styles.logoWrapper}>
            <Image
              src="/images/logo/Logo.png"
              alt="Logo Warung Tupaja"
              width={200}
              height={100}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
