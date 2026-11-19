
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOrder, updateOrder } from "../../../services/orderStorage";
import styles from "./cancel-modal.module.css";

const alasanPembatalan = [
  "Salah memilih menu",
  "Ingin mengubah pesanan",
  "Waktu tunggu terlalu lama",
  "Kesalahan pembayaran",
];

export default function CancelModalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");

  function handleTutup() {
    router.push("/tracking");
  }

  function handleKonfirmasi() {
    if (!alasan) {
      setError("Silakan pilih alasan pembatalan terlebih dahulu!");
      return;
    }

    const pesanan = orderId ? getOrder(orderId) : null;

    if (!pesanan) {
      setError("Pesanan tidak ditemukan.");
      return;
    }

    if (pesanan.status !== "Menunggu") {
      setError("Pesanan sudah diproses dan tidak dapat dibatalkan.");
      return;
    }

    const dataPembatalan = {
      ...pesanan,
      status: "Dibatalkan",
      alasanPembatalan: alasan,
      waktuPembatalan: Date.now(),
    };

    updateOrder(orderId, {
      status: "Dibatalkan",
      alasanPembatalan: alasan,
      waktuPembatalan: Date.now(),
    });

    localStorage.setItem(
      "warungTupaja_pesanan_dibatalkan",
      JSON.stringify(dataPembatalan)
    );

    router.push(
      `/rincian-pembatalan?orderId=${encodeURIComponent(orderId)}`
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>
          <div className={styles.blurredBackground}>
            <div className={styles.trackingBgCream}></div>

            <div className={styles.trackingWrapper}>
              <header className={styles.pageHeader}>
                <div className={styles.btnBack}>
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                Detail Pesanan
              </header>

              <div className={styles.backgroundContent}>
                <div className={styles.tableBanner}>
                  No. Meja : 1
                </div>

                <div className={styles.trackingItem}>
                  <div className={styles.imagePlaceholder}></div>
                  <div>
                    <h4>Detail Pesanan</h4>
                    <p>Pesanan yang dipilih</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.navBgWhite}></div>
            <div className={styles.bottomNav}></div>
          </div>

          <div className={styles.modalOverlay}>
            <div
              className={styles.modalBox}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-title"
            >
              <div className={styles.modalHeader}>
                <h3 id="cancel-title">Pilih Alasan Pembatalan</h3>

             <button
  type="button"
  className={styles.closeBtn}
  onClick={handleTutup}
  aria-label="Tutup"
>
  <i className="fa-solid fa-xmark"></i>
</button>
              </div>

              <div className={styles.radioGroup}>
                {alasanPembatalan.map((item) => (
                  <label className={styles.radioItem} key={item}>
                    <input
                      type="radio"
                      name="alasan"
                      value={item}
                      checked={alasan === item}
                      onChange={() => {
                        setAlasan(item);
                        setError("");
                      }}
                    />

                    <span className={styles.radioCircle}></span>
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {error && (
                <p className={styles.errorText}>{error}</p>
              )}

              <button
                type="button"
                className={styles.btnKonfirmasi}
                onClick={handleKonfirmasi}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
