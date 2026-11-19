export default function CategoryMenu({
  styles,
  items,
  activeCategory,
  onSelect,
}) {
  return (
    <>
      <div className={styles.sectionTitle}>Kategori Menu</div>

      <div
        className={`${styles.horizontalMenu} ${styles.categoryMenuContainer}`}
      >
        {items.map((category) => (
          <button
            className={`${styles.categoryCard} ${
              activeCategory === category.id
                ? styles.categoryCardActive
                : ""
            }`}
            data-kategori={category.id}
            key={category.id}
            type="button"
            aria-pressed={activeCategory === category.id}
            onClick={() => onSelect(category.id)}
          >
            <div className={styles.categoryImage}>
              <img src={category.image} alt={category.name} />
            </div>

            <h4>{category.name}</h4>
          </button>
        ))}
      </div>
    </>
  );
}