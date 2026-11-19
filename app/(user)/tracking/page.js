
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePesananPelangganMentah } from "../../../lib/pesananPelanggan";
import { useIsClient } from "../../../hooks/useIsClient";
import styles from "./tracking.module.css";

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function TrackingPage() {
  const router = useRouter();
  // Status pesanan ikut berubah otomatis saat admin memperbarui pesanan
  const pesanan = usePesananPelangganMentah();
  const isClient = useIsClient();

  function handleBatalkan(orderId) {
    router.push(
      `/cancel-modal?orderId=${encodeURIComponent(orderId)}`
    );
  }

  if (!isClient) return null;

  const pesananAktif = pesanan.filter(
    (order) => order.status !== "Dibatalkan"
  );

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>
          <div className={styles.trackingBgCream}></div>

          <div className={styles.trackingWrapper}>
            <header className={styles.pageHeader}>
              <Link
                href="/home"
                className={styles.btnBack}
                aria-label="Kembali ke Home"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              Detail Pesanan
            </header>

            <div className={styles.scrollableContent}>
              {pesananAktif.length > 0 ? (
                <div className={styles.ordersList}>
                  {pesananAktif.map((order) => (
                    <article className={styles.orderCard} key={order.id}>
                      <div className={styles.tableBanner}>
                        <strong>
                          Pesanan #{order.nomorPesanan}
                        </strong>

                        <div className={styles.antrianSection}>
                          <span>No. Meja : 1</span>
                          <span className={styles.antrianDivider}>—</span>
                          <span>Antrian : {order.nomorAntrian}</span>
                        </div>
                      </div>

                      <div className={styles.trackingList}>
                        {order.items.map((item, index) => (
                          <div
                            className={styles.trackingItem}
                            key={`${order.id}-${item.name}-${index}`}
                          >
                            <img
                              src={item.image || "/images/Nasi Goreng.jpeg"}
                              alt={item.name}
                            />

                            <div className={styles.trackingDetails}>
                              <h4>{item.name}</h4>
                              <p>
                                Harga&nbsp; : {formatRupiah(item.price)}
                              </p>
                              <p>Jumlah : {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className={styles.trackingFooter}>
                        <div className={styles.footerTopRow}>
                          <span
                            className={`${styles.statusBadge} ${
                              order.status === "Menunggu"
                                ? styles.menunggu
                                : order.status === "Proses"
                                  ? styles.proses
                                  : styles.selesai
                            }`}
                          >
                            {order.status}
                          </span>

                          <div className={styles.trackingTotal}>
                            Total :{" "}
                            <strong>{formatRupiah(order.total)}</strong>
                          </div>
                        </div>

                        {order.status === "Menunggu" && (
                          <div className={styles.footerBottomRow}>
                            <button
                              type="button"
                              className={styles.btnCancel}
                              onClick={() => handleBatalkan(order.id)}
                            >
                              Batalkan Pesanan
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyTracking}>
                  <h3>Belum ada pesanan</h3>
                  <p>Silakan kembali ke menu untuk memesan.</p>

                  <Link
                    href="/home"
                    className={styles.btnKembaliMenu}
                  >
                    Kembali ke Menu
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.navBgWhite}></div>

          <nav className={styles.bottomNav}>
            <Link href="/home" className={styles.navItem} aria-label="Home">
              <i className="fa-solid fa-house-chimney"></i>
            </Link>

            <Link href="/cart" className={styles.navItem} aria-label="Keranjang">
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>

            <Link
              href="/tracking"
              className={`${styles.navItem} ${styles.trackingNavActive}`}
              aria-label="Tracking"
            >
              <i className="fa-solid fa-file-lines"></i>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
