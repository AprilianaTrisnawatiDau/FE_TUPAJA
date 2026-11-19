
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addOrder } from "../../../services/orderStorage";
import styles from "./checkout.module.css";

function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [nama, setNama] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("Tunai");
  const [tipePemesanan, setTipePemesanan] = useState("Makan di Tempat");
  const [catatan, setCatatan] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("warungTupaja_cart") || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }

    setCatatan(localStorage.getItem("warungTupaja_catatan") || "");
    setLoaded(true);
  }, []);

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  function simpanPesanan() {
    const pesanan = addOrder({
      nama,
      items: cart.map((item) => ({ ...item })),
      total: totalPrice,
      metodePembayaran,
      tipePemesanan,
      catatan,
      pembayaran: "Belum Dibayar",
      tanggal: new Date().toLocaleString("id-ID"),
    });

    setOrderId(pesanan.id);
    return pesanan;
  }

  function handleKonfirmasi() {
    if (!nama.trim()) {
      alert("Mohon isi Nama Pelanggan terlebih dahulu!");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      router.push("/cart");
      return;
    }

    setShowModal(true);
  }

  function handleYa() {
    const pesanan = simpanPesanan();

    localStorage.removeItem("warungTupaja_catatan");
    setCatatan("");

    if (metodePembayaran === "QRIS") {
      router.push(
        `/pembayaran-qris?orderId=${encodeURIComponent(pesanan.id)}`
      );
      return;
    }

    setPaymentConfirmed(true);
  }

  function handleSelesai() {
    localStorage.removeItem("warungTupaja_cart");
    router.push("/tracking");
  }

  if (!loaded) return null;

  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>
          <div className={styles.checkoutBgCream}></div>

          <div className={styles.checkoutWrapper}>
            <header className={styles.pageHeader}>
              <Link
                href="/cart"
                className={styles.btnBack}
                aria-label="Kembali ke Keranjang"
              >
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
              Check-Out
            </header>

            <div className={styles.scrollableContent}>
              {cart.length === 0 ? (
                <div className={styles.emptyCheckout}>
                  <h3>Keranjang masih kosong</h3>
                  <p>Silakan tambahkan menu terlebih dahulu.</p>
                  <Link href="/home" className={styles.btnKembali}>
                    Lihat Menu
                  </Link>
                </div>
              ) : (
                <div className={styles.checkoutContent}>
                  <div className={styles.formGroup}>
                    <label htmlFor="nama-pelanggan">
                      Nama Pelanggan
                    </label>

                    <input
                      type="text"
                      id="nama-pelanggan"
                      className={styles.formControl}
                      placeholder="Isi nama anda..."
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />

                    {!nama.trim() && (
                      <span className={styles.errorText}>
                        *wajib diisi
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Metode Pembayaran :</label>

                    <div className={styles.radioGroup}>
                      {["Tunai", "QRIS"].map((metode) => (
                        <button
                          type="button"
                          key={metode}
                          className={`${styles.radioOption} ${
                            metodePembayaran === metode ? styles.selected : ""
                          }`}
                          onClick={() => setMetodePembayaran(metode)}
                        >
                          {metode}
                          <span className={styles.radioCircle}></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Tipe Pemesanan</label>

                    <div className={styles.radioGroup}>
                      {["Makan di Tempat", "Dibungkus"].map((tipe) => (
                        <button
                          type="button"
                          key={tipe}
                          className={`${styles.radioOption} ${
                            tipePemesanan === tipe ? styles.selected : ""
                          }`}
                          onClick={() => setTipePemesanan(tipe)}
                        >
                          {tipe}
                          <span className={styles.radioCircle}></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {catatan.trim() !== "" && (
                    <div className={styles.formGroup}>
                      <label>Catatan Pesanan :</label>
                      <div className={styles.catatanBox}>
                        "{catatan}"
                      </div>
                    </div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Ringkasan Pembayaran :</label>

                    <div className={styles.summaryBox}>
                      <div className={styles.summaryRow}>
                        <span>Total Pesanan : {totalItems}</span>
                      </div>

                      <div className={styles.summaryDivider}></div>

                      <div className={styles.summaryRow}>
                        <span>
                          Total Bayar :{" "}
                          <strong>{formatRupiah(totalPrice)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <footer className={styles.checkoutFooter}>
                <button
                  type="button"
                  className={styles.btnKonfirmasi}
                  onClick={handleKonfirmasi}
                >
                  Konfirmasi
                </button>
              </footer>
            )}
          </div>

          {showModal && (
            <div className={styles.overlay}>
              <div className={styles.modalCard}>
                {!paymentConfirmed ? (
                  <>
                    <h3>
                      Apakah kamu ingin melanjutkan pembayaran?
                    </h3>

                    <div className={styles.modalActions}>
                      <button
                        type="button"
                        className={styles.btnModalTidak}
                        onClick={() => setShowModal(false)}
                      >
                        Tidak
                      </button>

                      <button
                        type="button"
                        className={styles.btnModalYa}
                        onClick={handleYa}
                      >
                        Ya
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>Selesaikan Pembayaran!</h3>
                    <p>
                      Silakan pergi ke kasir untuk melakukan pembayaran.
                    </p>

                    <button
                      type="button"
                      className={styles.btnModalOk}
                      onClick={handleSelesai}
                    >
                      Ok
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
  