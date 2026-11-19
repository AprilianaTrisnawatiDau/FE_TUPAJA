"use client";

import { useEffect, useMemo, useState } from "react";
import { getStatusWarung, useStatusWarung } from "../../../lib/statusWarung";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import styles from "./home.module.css";

import {
  categories,
  popularMenus,
  categoryItems,
} from "../../../data/menuData";

import MobileFrame from "../../../components/layout/MobileFrame";
import BottomNav from "../../../components/layout/CustomerBottomNav";
import SearchBar from "../../../components/home/SearchBar";
import PopularMenu from "../../../components/home/PopularMenu";
import CategoryMenu from "../../../components/home/CategoryMenu";
import MenuCard from "../../../components/home/MenuCard";
import { ClientOnly, bacaStorage } from "../../../hooks/useIsClient";

function HomeContent({ showClosedInitially = false }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // keranjang dibaca langsung dari localStorage (komponen ini hanya jalan di browser)
  const [cart, setCart] = useState(() => {
    const savedCart = bacaStorage("warungTupaja_cart", []);
    return Array.isArray(savedCart) ? savedCart : [];
  });
  const [activeCategory, setActiveCategory] = useState(
    categories?.[0]?.id || ""
  );
  const [keyword, setKeyword] = useState("");
  // Modal "warung tutup" langsung tampil bila warung sedang tutup
  const [showClosedModal, setShowClosedModal] = useState(
    () =>
      showClosedInitially ||
      searchParams.get("tutup") === "true" ||
      !getStatusWarung().buka
  );
  // Kalau admin menutup warung saat pelanggan sedang di halaman ini, modal ikut muncul
  const statusWarung = useStatusWarung();
  const tampilModalTutup = showClosedModal || !statusWarung.buka;

  // Menyimpan data keranjang
  useEffect(() => {
    localStorage.setItem(
      "warungTupaja_cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  // Menambahkan produk ke keranjang
  const addToCart = (menu) => {
    if (!menu || menu.soldOut) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.name === menu.name
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.name === menu.name
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          name: menu.name,
          price: menu.price,
          image: menu.image,
          quantity: 1,
        },
      ];
    });
  };

  // Memilih kategori
  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setKeyword("");
  };

  // Menyaring menu
  const filteredMenus = useMemo(() => {
    const searchKeyword = keyword.trim().toLowerCase();

    // Jika sedang mencari, ambil menu dari seluruh kategori
    if (searchKeyword) {
      const allMenus = categories.flatMap(
        (category) => category.products || []
      );

      return allMenus.filter((menu) =>
        menu.name?.toLowerCase().includes(searchKeyword)
      );
    }

    // Jika tidak mencari, tampilkan kategori aktif
    const selectedCategory = categories.find(
      (category) => category.id === activeCategory
    );

    return selectedCategory?.products || [];
  }, [activeCategory, keyword]);

  // Menutup modal dan kembali ke halaman warung tutup
  const closeModalAndRedirect = () => {
    setShowClosedModal(false);
    sessionStorage.setItem("sudahLihatPopUp", "true");
    router.push("/warung-tutup");
  };

  const activeCategoryName =
    categories.find(
      (category) => category.id === activeCategory
    )?.name || "Menu";

  return (
    <MobileFrame styles={styles}>
      {/* AREA SCROLL */}
      <div className={styles.scrollContent}>
        <div className={styles.fixedTopSection}>
          <header className={styles.topHeader}>
            <SearchBar
              styles={styles}
              value={keyword}
              onChange={setKeyword}
            />
          </header>

          <div className={styles.stickyHeaderContent}>
            <div className={styles.tableBanner}>
              No. Meja : 1
            </div>

            {!keyword && (
              <PopularMenu
                styles={styles}
                items={popularMenus}
                onAdd={addToCart}
              />
            )}

            <CategoryMenu
              styles={styles}
              items={categoryItems}
              activeCategory={activeCategory}
              onSelect={selectCategory}
            />

            <div className={styles.categoryHeaderTitle}>
              {keyword ? "Hasil Pencarian" : activeCategoryName}
            </div>
          </div>
        </div>

        <div className={styles.scrollableMenuArea}>
          {filteredMenus.length > 0 ? (
            <div className={styles.gridMenu}>
              {filteredMenus.map((item, index) => (
                <MenuCard
                  key={item.name}
                  styles={styles}
                  product={item}
                  onAdd={addToCart}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptySearch}>
              <p>Menu tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGASI TETAP DI BAWAH FRAME */}
      <BottomNav
        styles={styles}
        totalItems={cart.reduce(
          (total, item) => total + item.quantity,
          0
        )}
      />

      {/* MODAL WARUNG TUTUP */}
      {tampilModalTutup && (
        <div className={styles.overlay}>
          <div className={styles.modalCard}>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Tutup"
              onClick={closeModalAndRedirect}
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className={styles.modalIcon}>
              <i className="fa-solid fa-store-slash" />
            </div>

            <h3>Warung Tutup</h3>

            <p>
              Maaf, saat ini warung sedang tutup.
              <br />
              Silakan kembali lagi nanti.
            </p>

            <button
              type="button"
              className={styles.primaryButton}
              onClick={closeModalAndRedirect}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}

export default function HomePage(props) {
  return (
    <Suspense fallback={null}>
      <ClientOnly>
        <HomeContent {...props} />
      </ClientOnly>
    </Suspense>
  );
}