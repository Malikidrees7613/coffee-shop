/**
 * Artisan Coffee — Shared Cart Module
 * Uses localStorage key: "artisanCart"
 * Each item: { id, name, price, qty, img, desc }
 */

const CART_KEY = 'artisanCart';

// ── Read / Write ─────────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Add item (merges qty if already exists) ──────────────────────
function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  updateAllBadges();
}

// ── Count total items ────────────────────────────────────────────
function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

// ── Update every .cart-badge on the page ─────────────────────────
function updateAllBadges() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ── Toast notification ───────────────────────────────────────────
let _toastTimer;
function showCartToast(name) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:9999;
      display:flex; align-items:center; gap:0.75rem;
      background:#2E1F1B; color:#fff;
      padding:0.9rem 1.25rem; border-radius:0.75rem;
      box-shadow:0 20px 40px rgba(0,0,0,0.3);
      font-family:'Work Sans',sans-serif; font-size:0.875rem; font-weight:600;
      opacity:0; transform:translateY(12px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events:none;
    `;
    toast.innerHTML = `
      <span style="color:#C8A951;font-family:'Material Symbols Outlined';font-size:1.25rem;font-weight:400">check_circle</span>
      <span id="cart-toast-msg"></span>
      <a href="cart.html" style="margin-left:0.5rem;color:#C8A951;text-decoration:underline;font-size:0.75rem;pointer-events:all;">View Cart →</a>
    `;
    document.body.appendChild(toast);
  }
  document.getElementById('cart-toast-msg').textContent = `"${name}" added to cart!`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 2800);
}

// ── Animate the cart icon (bounce) ──────────────────────────────
function bounceCartIcon() {
  document.querySelectorAll('.cart-icon-bounce').forEach(el => {
    el.style.transform = 'scale(1.35)';
    setTimeout(() => el.style.transform = '', 250);
  });
}

// ── Init on page load ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateAllBadges();
});

// Expose globally
window.ArtisanCart = { addToCart, getCart, getCartCount, updateAllBadges, showCartToast, bounceCartIcon };
