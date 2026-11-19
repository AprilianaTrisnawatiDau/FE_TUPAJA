import { apiFetch } from "./api";

export function getMenus() {
  return apiFetch("/menus");
}

export function getMenuById(id) {
  return apiFetch(`/menus/${encodeURIComponent(id)}`);
}

export function getCategories() {
  return apiFetch("/categories");
}
