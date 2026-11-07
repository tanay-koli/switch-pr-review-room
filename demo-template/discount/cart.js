// Tiny shopping-cart library. Prices are in rupees.
const TAX_RATE = 0.18; // GST

const DISCOUNT_CODES = {
  SAVE10: 0.1,
  FESTIVE20: 0.2,
};

function round2(n) {
  return Math.round(n * 100) / 100;
}

function createCart() {
  return { items: [], discount: 0 };
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

function applyDiscountCode(cart, code) {
  const rate = DISCOUNT_CODES[code];
  if (rate) {
    cart.discount = rate;
  }
  return cart;
}

function total(cart) {
  const sub = subtotal(cart);
  const discounted = sub * (1 - cart.discount);
  const taxed = discounted * (1 + TAX_RATE);
  return round2(taxed * (1 - cart.discount));
}

module.exports = { TAX_RATE, DISCOUNT_CODES, createCart, applyDiscountCode, addItem, removeItem, subtotal, total };
