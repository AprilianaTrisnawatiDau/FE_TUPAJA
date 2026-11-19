
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./rincian-pembatalan.module.css";
import { getOrder } from "../../../services/orderStorage";

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

function RincianPembatalanContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [pesanan, setPesanan] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      let dataPesanan = orderId ? getOrder(orderId) : null;

      if (!dataPesanan) {
        const savedPesanan = localStorage.getItem(
          "warungTupaja_pesanan_dibatalkan"
        );

        dataPesanan = savedPesanan
          ? JSON.parse(savedPesanan)
          : null;
      }

      setPesanan(dataPesanan);
    } catch (error) {
      console.error("Gagal membaca rincian pembatalan:", error);
      setPesanan(null);
    }

    setLoaded(true);
  }, [orderId]);

  if (!loaded) return null;

  const items = Array.isArray(pesanan?.items)
    ? pesanan.items
    : [];

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>

          <div className={styles.trackingBgCream}></div>

          <div className={styles.trackingWrapper}>

            <header className={styles.pageHeader}>
              <Link
                href="/tracking"
                className={styles.btnBack}
                aria-label="Kembali"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>

              Rincian Pembatalan
            </header>

            <div className={styles.scrollableContent}>

              <div className={styles.successAlert}>
                <span>Pembatalan Berhasil</span>
                <i className="fa-solid fa-check"></i>
              </div>

              {pesanan && items.length > 0 ? (
                <div className={styles.orderCard}>

                  <div className={styles.trackingList}>
                    {items.map((item, index) => (
                      <div
                        className={styles.trackingItem}
                        key={item.id || `${item.name}-${index}`}
                      >
                        <img
                          src={
                            item.image ||
                            "/images/Nasi Goreng.jpeg"
                          }
                          alt={item.name || "Menu pesanan"}
                        />

                        <div className={styles.trackingDetails}>
                          <h4>{item.name}</h4>

                          <p>
                            Harga&nbsp;&nbsp; :&nbsp;{" "}
                            {formatRupiah(item.price)}
                          </p>

                          <p>
                            Jumlah : {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.trackingFooter}>
                    <span className={styles.statusBadge}>
                      Dibatalkan
                    </span>

                    <div className={styles.trackingTotal}>
                      Total :{" "}
                      <strong>
                        {formatRupiah(pesanan.total)}
                      </strong>
                    </div>
                  </div>

                </div>
              ) : (
                <div className={styles.emptyCancellation}>
                  <p>Tidak ada rincian pembatalan.</p>

                  <Link
                    href="/tracking"
                    className={styles.btnKembali}
                  >
                    Kembali ke Tracking
                  </Link>
                </div>
              )}

            </div>
          </div>

          <div className={styles.navBgWhite}></div>

          <nav className={styles.bottomNav}>
  <Link href="/home" className={styles.navItem}>
    <i className="fa-solid fa-house-chimney"></i>
  </Link>

  <Link href="/cart" className={styles.navItem}>
    <i className="fa-solid fa-cart-shopping"></i>
  </Link>

  <Link
    href="/tracking"
    className={`${styles.navItem} ${styles.trackingNavActive}`}
  >
    <i className="fa-solid fa-file-lines"></i>
  </Link>
</nav>

        </div>
      </div>
    </main>
  );
}

export default function RincianPembatalanPage() {
  return (
    <Suspense fallback={null}>
      <RincianPembatalanContent />
    </Suspense>
  );
}