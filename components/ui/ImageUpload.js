"use client";
import { ImageIcon } from "lucide-react";
import { useRef } from "react";
import FoodImage from "./FoodImage";
/* Kotak gambar + "Upload Gambar / Pilih File" (dipakai di modal tambah/edit) */
export default function ImageUpload({ value, onChange }) {
  const ref = useRef(null);
  return (
    <div className="flex items-end justify-between gap-3">
      {value ? (
        <FoodImage src={value} alt="Preview" className="h-[72px] w-[72px] rounded-lg" />
      ) : (
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-lg bg-[#d9d9d9]">
          <ImageIcon className="h-7 w-7 text-gray-500" strokeWidth={1.6} />
        </div>
      )}
      <div className="text-center">
        <p className="text-[10px] text-gray-600">Upload Gambar</p>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="mt-0.5 rounded bg-abu px-3 py-0.5 text-[9px] font-semibold hover:brightness-95"
        >
          Pilih File
        </button>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange(URL.createObjectURL(f));
          }}
        />
      </div>
    </div>
  );
}
