export default function MobileFrame({ children, styles }) {
  return (
    <main className={styles.page}>
      <div className={styles.mobileFrame}>
        <div className={styles.screen}>
          {children}
        </div>
      </div>
    </main>
  );
}