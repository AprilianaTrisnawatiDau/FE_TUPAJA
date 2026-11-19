
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./cart.module.css";
import { ClientOnly, bacaStorage } from "../../../hooks/useIsClient";

function formatRupiah(value) {
    return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function CartPage() {
    return (
        <ClientOnly>
            <CartContent />
        </ClientOnly>
    );
}

function CartContent() {
    // data langsung dibaca dari localStorage (komponen ini hanya jalan di browser)
    const [cart, setCart] = useState(() => {
        const savedCart = bacaStorage("warungTupaja_cart", []);
        return Array.isArray(savedCart) ? savedCart : [];
    });
    const [note, setNote] = useState(
        () => localStorage.getItem("warungTupaja_catatan") || ""
    );

    useEffect(() => {
        localStorage.setItem(
            "warungTupaja_cart",
            JSON.stringify(cart)
        );
    }, [cart]);

    const totalPrice = cart.reduce((total, item) => {
        return (
            total +
            Number(item.price || 0) * Number(item.quantity || 0)
        );
    }, 0);

    function updateQuantity(index, change) {
        setCart((currentCart) => {
            return currentCart
                .map((item, i) => {
                    if (i === index) {
                        return {
                            ...item,
                            quantity: Number(item.quantity || 0) + change,
                        };
                    }

                    return item;
                })
                .filter((item) => Number(item.quantity) > 0);
        });
    }

    function handleNoteChange(event) {
        const value = event.target.value;

        setNote(value);
        localStorage.setItem("warungTupaja_catatan", value);
    }

    return (
        <main className={styles.page}>
            <div className={styles.mobileFrame}>
                <div className={styles.screen}>
                    <div className={styles.cartBgCream}></div>

                    <div className={styles.cartContentWrapper}>
                        <header className={styles.pageHeader}>
                            <Link
                                href="/home"
                                className={styles.btnBack}
                                aria-label="Kembali ke Home"
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                            </Link>

                            <span>Keranjang</span>
                        </header>

                        <div className={styles.scrollableContent}>
                            {cart.length === 0 ? (
                                <div className={styles.emptyCart}>
                                    <i className="fa-solid fa-cart-shopping"></i>

                                    <h3>Keranjang masih kosong</h3>

                                    <p>
                                        Tambahkan menu favoritmu terlebih dahulu.
                                    </p>

                                    <Link href="/home" className={styles.btnEmpty}>
                                        Lihat Menu
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.cartItems}>
                                        {cart.map((item, index) => (
                                            <article
                                                className={styles.cartItem}
                                                key={`${item.name}-${index}`}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />

                                                <div className={styles.cartDetails}>
                                                    <h4>{item.name}</h4>

                                                    <div className={styles.price}>
                                                        {formatRupiah(item.price)}
                                                    </div>

                                                    <div className={styles.qtyControl}>
                                                        <button
                                                            type="button"
                                                            className={styles.btnQty}
                                                            onClick={() =>
                                                                updateQuantity(index, -1)
                                                            }
                                                        >
                                                            −
                                                        </button>

                                                        <span className={styles.qtyNumber}>
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className={`${styles.btnQty} ${styles.plus}`}
                                                            onClick={() =>
                                                                updateQuantity(index, 1)
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>

                                    <label className={styles.notesArea}>
                                        <i className="fa-solid fa-pen-to-square"></i>

                                        <input
                                            type="text"
                                            placeholder="Catatan..."
                                            value={note}
                                            onChange={handleNoteChange}
                                        />
                                    </label>
                                </>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className={styles.bottomActionBar}>
                                <div className={styles.totalPriceBox}>
                                    <span>Total Pembayaran</span>

                                    <strong>
                                        {formatRupiah(totalPrice)}
                                    </strong>
                                </div>

                                <Link
                                    href="/checkout"
                                    className={styles.btnPrimary}
                                >
                                    Lanjut Check-out
                                </Link>
                            </div>
                        )}
                    </div>

                    {cart.length === 0 && (
                        <>
                            <div className={styles.navBgWhite}></div>

                            <nav className={styles.bottomNav}>
                                <Link
                                    href="/home"
                                    className={styles.navItem}
                                    aria-label="Home"
                                >
                                    <i className="fa-solid fa-house-chimney"></i>
                                </Link>

                                <Link
                                    href="/cart"
                                    className={`${styles.navItem} ${styles.cartNavActive}`}
                                    aria-label="Keranjang"
                                >
                                    <i className="fa-solid fa-cart-shopping"></i>
                                </Link>

                                <Link
                                    href="/tracking"
                                    className={styles.navItem}
                                    aria-label="Tracking"
                                >
                                    <i className="fa-regular fa-file-lines"></i>
                                </Link>
                            </nav>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
