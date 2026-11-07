const test = require("node:test");
const assert = require("node:assert");
const { createCart, applyDiscountCode, addItem, removeItem, subtotal, total } = require("../src/cart");

test("empty cart totals to zero", () => {
  const cart = createCart();
  assert.strictEqual(subtotal(cart), 0);
  assert.strictEqual(total(cart), 0);
});

test("subtotal adds price times quantity", () => {
  const cart = createCart();
  addItem(cart, { name: "notebook", price: 120, qty: 2 });
  addItem(cart, { name: "pen", price: 30 });
  assert.strictEqual(subtotal(cart), 270);
});

test("adding the same item twice merges quantity", () => {
  const cart = createCart();
  addItem(cart, { name: "pen", price: 30 });
  addItem(cart, { name: "pen", price: 30, qty: 2 });
  assert.strictEqual(cart.items.length, 1);
  assert.strictEqual(cart.items[0].qty, 3);
});

test("removeItem drops the item", () => {
  const cart = createCart();
  addItem(cart, { name: "pen", price: 30 });
  removeItem(cart, "pen");
  assert.strictEqual(cart.items.length, 0);
});

test("total includes 18% GST", () => {
  const cart = createCart();
  addItem(cart, { name: "bag", price: 1000 });
  assert.strictEqual(total(cart), 1180);
});

test("invalid items are rejected", () => {
  const cart = createCart();
  assert.throws(() => addItem(cart, { name: "", price: 10 }));
  assert.throws(() => addItem(cart, { name: "x", price: -1 }));
  assert.throws(() => addItem(cart, { name: "x", price: 10, qty: 0 }));
});

test("SAVE10 takes 10% off before GST", () => {
  const cart = createCart();
  addItem(cart, { name: "bag", price: 1000 });
  applyDiscountCode(cart, "SAVE10");
  assert.strictEqual(total(cart), 1062);
});
