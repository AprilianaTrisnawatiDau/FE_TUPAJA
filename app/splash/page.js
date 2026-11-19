
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { STORE_STATUS } from "../../data/storeConfig";
import styles from "../splash.module.css";

export default function SplashPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (STORE_STATUS === "buka") {
        window.location.replace("/home");
      } else {
        window.location.replace("/home?tutup=true");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
