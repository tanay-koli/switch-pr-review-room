// Tiny shopping-cart library. Prices are in rupees.
const TAX_RATE = 0.18; // GST

function round2(n) {
  return Math.round(n * 100) / 100;
}

function createCart() {
  return { items: [] };
}

function addItem(cart, item) {
  if (!item || typeof item.name !== "string" || item.name === "") {
    throw new Error("Item needs a name");
  }
  if (typeof item.price !== "number" || item.price < 0) {
    throw new Error("Item price must be a non-negative number");
  }
  const qty = item.qty ?? 1;
  if (!Number.isInteger(qty) || qty < 1) {
    throw new Error("Quantity must be a positive whole number");
  }
  const existing = cart.items.find((i) => i.name === item.name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ name: item.name, price: item.price, qty });
  }
  return cart;
}

function removeItem(cart, name) {
  cart.items = cart.items.filter((i) => i.name !== name);
  return cart;
}

function subtotal(cart) {
  return round2(cart.items.reduce((sum, i) => sum + i.price * i.qty, 0));
}

function total(cart) {
  const sub = subtotal(cart);
  return round2(sub * (1 + TAX_RATE));
}

module.exports = { TAX_RATE, createCart, addItem, removeItem, subtotal, total };
