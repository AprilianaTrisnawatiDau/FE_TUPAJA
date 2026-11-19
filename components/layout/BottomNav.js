"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav({ styles, totalItems = 0 }) {
  const pathname = usePathname();

  const activeRoute = pathname.startsWith("/cart")
    ? "cart"
    : pathname.startsWith("/tracking")
      ? "tracking"
      : "home";

  const getActiveClass = (route) => {
    if (activeRoute !== route) return "";

    switch (route) {
      case "cart":
        return styles.navItemActiveCart;
      case "tracking":
        return styles.navItemActiveTracking;
      default:
        return styles.navItemActive;
    }
  };

  return (
    <>
      <div className={styles.navBackground} />

      <nav className={styles.bottomNav} aria-label="Navigasi utama">
        <Link
          href="/home"
          className={`${styles.navItem} ${getActiveClass("home")}`}
          aria-label="Home"
          aria-current={activeRoute === "home" ? "page" : undefined}
        >
          <i className="fa-solid fa-house-chimney" />
        </Link>

        <Link
          href="/cart"
          className={`${styles.navItem} ${getActiveClass("cart")}`}
          aria-label="Keranjang"
          aria-current={activeRoute === "cart" ? "page" : undefined}
        >
          <i className="fa-solid fa-cart-shopping" />

          {totalItems > 0 && (
            <span className={styles.cartBadge}>
              {totalItems}
            </span>
          )}
        </Link>

        <Link
          href="/tracking"
          className={`${styles.navItem} ${getActiveClass("tracking")}`}
          aria-label="Tracking"
          aria-current={activeRoute === "tracking" ? "page" : undefined}
        >
          <i className="fa-regular fa-file-lines" />
        </Link>
      </nav>
    </>
  );
}