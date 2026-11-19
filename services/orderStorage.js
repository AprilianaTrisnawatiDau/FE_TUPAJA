
const ORDERS_KEY = "warungTupaja_daftar_pesanan";
const ACTIVE_ORDER_KEY = "warungTupaja_pesanan_aktif";
const LEGACY_ORDER_KEY = "warungTupaja_pesanan";

export function getOrders() {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(ORDERS_KEY);

    if (saved !== null) {
      const orders = JSON.parse(saved);
      return Array.isArray(orders) ? orders : [];
    }

    // Migrasi pesanan dari sistem lama
    const oldOrder = JSON.parse(
      localStorage.getItem(LEGACY_ORDER_KEY) || "null"
    );

    if (oldOrder && Array.isArray(oldOrder.items)) {
      const migratedOrder = {
        ...oldOrder,
        id: oldOrder.id || `ORDER-${Date.now()}-1`,
        nomorPesanan: oldOrder.nomorPesanan || 1,
        nomorAntrian: oldOrder.nomorAntrian || 1,
        waktuPesan: oldOrder.waktuPesan || Date.now(),
        status: oldOrder.status || "Menunggu",
      };

      const orders = [migratedOrder];
      saveOrders(orders);

      return orders;
    }

    saveOrders([]);
    return [];
  } catch (error) {
    console.error("Gagal membaca daftar pesanan:", error);
    return [];
  }
}

export function saveOrders(orders) {
  if (typeof window === "undefined") return;

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function addOrder(order) {
  const orders = getOrders();

  const nomorPesanan =
    orders.reduce(
      (max, item) =>
        Math.max(max, Number(item.nomorPesanan || 0)),
      0
    ) + 1;

  const nomorAntrian =
    orders.reduce(
      (max, item) =>
        Math.max(max, Number(item.nomorAntrian || 0)),
      0
    ) + 1;

  const newOrder = {
    ...order,
    id: `ORDER-${Date.now()}-${nomorPesanan}`,
    nomorPesanan,
    nomorAntrian,
    waktuPesan: Date.now(),
    status: "Menunggu",
  };

  saveOrders([...orders, newOrder]);

  localStorage.setItem(ACTIVE_ORDER_KEY, newOrder.id);
  localStorage.setItem(
    LEGACY_ORDER_KEY,
    JSON.stringify(newOrder)
  );

  return newOrder;
}

export function getOrder(orderId) {
  return getOrders().find(
    (order) => order.id === orderId
  ) || null;
}

export function updateOrder(orderId, changes) {
  const orders = getOrders();

  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? { ...order, ...changes }
      : order
  );

  saveOrders(updatedOrders);

  const updatedOrder = updatedOrders.find(
    (order) => order.id === orderId
  );

  if (updatedOrder) {
    localStorage.setItem(
      LEGACY_ORDER_KEY,
      JSON.stringify(updatedOrder)
    );
  }

  return updatedOrders;
}
