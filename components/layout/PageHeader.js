import { Search } from "lucide-react";
/* Header oranye + lembar putih melengkung + kolom cari (sesuai desain) */
export default function PageHeader({ title, subtitle, right, search, onSearch, searchPlaceholder = "CARI", children }) {
  return (
    <>
      <header className="bg-brand px-6 pt-7 pb-12 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="anim-head text-[22px] leading-tight font-bold">{title}</h1>
            <p className="anim-head-2 mt-0.5 text-[11px] leading-snug text-white/90">{subtitle}</p>
          </div>
          {right}
        </div>
      </header>
      <div className="anim-sheet relative -mt-7 rounded-t-[30px] bg-white">
        {onSearch && (
          <div className="relative -top-5 mx-5">
            <div className="flex items-center gap-2.5 rounded-full border-2 border-garis bg-white px-4 py-2 shadow-sm transition duration-200 focus-within:border-brand focus-within:shadow-md focus-within:shadow-brand/20">
              <Search className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} />
              <input
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-[12px] outline-none placeholder:text-gray-300"
              />
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
}
