function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function PopularMenu({ styles, items, onAdd }) {
  return (
    <>
      <div className={styles.sectionTitle}>
        <i className="fa-solid fa-star" />
        Menu Populer
      </div>

      <div className={`${styles.horizontalMenu} ${styles.popularDivider}`}>
        {items.map((product, index) => (
          <article
            className={`${styles.popularCard} ${styles.cardEntrance}`}
            style={{ "--card-index": index }}
            key={product.name}
          >
            <div className={styles.popularImage}>
              <img src={product.image} alt={product.name} />
            </div>

            <h4>{product.name}</h4>

            <div className={styles.price}>
              {formatRupiah(product.price)}
            </div>

            <button
              className={styles.addButton}
              type="button"
              aria-label={`Tambah ${product.name}`}
              onClick={() => onAdd(product)}
            >
              <i className="fa-solid fa-plus" />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}