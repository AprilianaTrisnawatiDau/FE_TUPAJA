
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getOrder,
  updateOrder,
} from "../../../services/orderStorage";
import styles from "./pembayaran-qris.module.css";

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

function PembayaranQrisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [pesanan, setPesanan] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const data = orderId ? getOrder(orderId) : null;

    setPesanan(data);
    setLoaded(true);

    if (!data || data.pembayaran === "Lunas") return;

    const timer = setTimeout(() => {
      updateOrder(orderId, { pembayaran: "Lunas" });

      setPesanan((current) =>
        current ? { ...current, pembayaran: "Lunas" } : current
      );

      setShowModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  function handleSelesai() {
    localStorage.removeItem("warungTupaja_cart");
    localStorage.removeItem("warungTupaja_catatan");
    router.push("/tracking");
  }

  if (!loaded) return null;

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>
          <div className={styles.qrisBgCream}></div>

          <div className={styles.qrisWrapper}>
            <header className={styles.pageHeader}>
              <Link
                href="/checkout"
                className={styles.btnBack}
                aria-label="Kembali ke Checkout"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              Pembayaran
            </header>

            <div className={styles.qrisContainer}>
              {pesanan ? (
                <>
                  <div className={styles.qrisCard}>
                    <div className={styles.qrisLogo}>
                      <i className="fa-solid fa-qrcode"></i>
                      QRIS
                    </div>

                    <div className={styles.qrisNamaWarung}>
                      Warung Tunggal Putra
                    </div>

                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                      alt="QRIS Code Dummy"
                      className={styles.qrisCodeImg}
                    />

                    <div className={styles.qrisTotal}>
                      Total Pembayaran
                    </div>

                    <div className={styles.qrisHarga}>
                      {formatRupiah(pesanan.total)}
                    </div>
                  </div>

                  <p className={styles.qrisInstruction}>
                    Scan QR Code di atas untuk melakukan pembayaran.
                  </p>
                </>
              ) : (
                <p>Data pesanan tidak ditemukan.</p>
              )}
            </div>

            {showModal && (
              <>
                <div className={styles.overlayBg}></div>

                <div
                  className={styles.modalQris}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="qris-success-title"
                >
                  <h3 id="qris-success-title">
                    Pembayaran Berhasil!
                  </h3>

                  <button type="button" onClick={handleSelesai}>
                    Ok
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PembayaranQrisPage() {
  return (
    <Suspense fallback={null}>
      <PembayaranQrisContent />
    </Suspense>
  );
}