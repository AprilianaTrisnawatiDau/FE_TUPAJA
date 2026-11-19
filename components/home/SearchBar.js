export default function SearchBar({ styles, value, onChange }) {
  return (
    <div className={styles.searchBar}>
      <i className="fa-solid fa-magnifying-glass" />

      <input
        type="text"
        placeholder="Cari menu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}