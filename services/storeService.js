
import { apiFetch } from "./api";

export async function createCustomerSession(qrToken) {
  const result = await apiFetch(
    `/sessions?qrToken=${encodeURIComponent(qrToken)}`,
    {
      method: "POST",
    }
  );

  if (!result.status) {
    throw new Error(result.message || "Gagal membuat session");
  }

  return result.data;
}

export async function getStoreStatus(sessionToken) {
  try {
    const result = await apiFetch("/status", {
      method: "GET",
      headers: {
        "x-customer-session": sessionToken,
      },
      cache: "no-store",
    });

    if (!result.success) {
      throw new Error(result.message || "Gagal memeriksa status warung");
    }

    return result.data.isOpen;
  } catch (error) {
    if (
      error.message ===
      "Warung sedang tutup. Pemesanan belum tersedia."
    ) {
      return false;
    }

    throw error;
  }
}
