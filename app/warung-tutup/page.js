import Image from "next/image";
import styles from "./warung-tutup.module.css";

export default function WarungTutupPage() {
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