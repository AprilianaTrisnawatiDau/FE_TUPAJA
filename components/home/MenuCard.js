function formatRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function MenuCard({ styles, product, onAdd, index = 0 }) {
  return (
    <article
      className={`${styles.productCard} ${styles.cardEntrance} ${
        product.soldOut ? styles.soldOutCard : ""
      }`}
      style={{ "--card-index": index }}
    >
      <div
        className={`${styles.productImage} ${
          product.soldOut ? styles.soldOutImage : ""
        }`}
      >
        <img src={product.image} alt={product.name} />
      </div>

      <h4>{product.name}</h4>

      <div className={styles.price}>
        {formatRupiah(product.price)}
      </div>

      {product.soldOut ? (
        <span className={styles.soldOutLabel}>Stok Habis</span>
      ) : (
        <button
          className={styles.addButton}
          type="button"
          aria-label={`Tambah ${product.name}`}
          onClick={() => onAdd(product)}
        >
          <i className="fa-solid fa-plus" />
        </button>
      )}
    </article>
  );
}