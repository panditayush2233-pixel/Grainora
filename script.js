const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const WHATSAPP_NUMBER = "917309011129"; // Change to your preferred WhatsApp number, country code first.
let cart = {};
let currentFilter = "all";

const money = n => "₹" + Number(n).toLocaleString("en-IN", {maximumFractionDigits:2});
const productById = id => PRODUCTS.find(p => p.id === id);

function renderProducts() {
  const shown = PRODUCTS.filter(p => currentFilter === "all" || p.category === currentFilter);
  $("#productCount").textContent = `${String(shown.length).padStart(2,"0")} PRODUCTS`;
  $("#productGrid").innerHTML = shown.map((p, i) => `
    <article class="product-card">
      <div class="product-image">
        <span class="product-tag">${p.tag || "GRAINORA PICK"}</span>
        <img src="${p.image}" alt="${p.name} packaging" loading="lazy" onerror="this.src='assets/millet-ladoo.png'">
        <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to cart">+</button>
      </div>
      <div class="product-info">
        <span class="product-category">${({sweets:"Millet sweets",seeds:"Seed bites",staples:"Daily staples"})[p.category] || "Grainora collection"}</span>
        <h3>${p.name}</h3><p class="product-description">${p.description || "A Grainora favourite, inspired by traditional flavours."}</p>
        <div class="product-bottom"><span class="price">${money(p.price)} <small>/ ${p.pack || "pack"}</small></span><span class="add-label">ADD TO BAG ↗</span></div>
      </div>
    </article>`).join("");
}
function addToCart(id) {
  const p = productById(id); if (!p) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart(); showToast(`${p.name} added to your cart`);
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}
function renderCart() {
  const entries = Object.entries(cart).filter(([id, qty]) => productById(id) && qty > 0);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + productById(id).price * qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#subtotal").textContent = money(total);
  $("#grandTotal").textContent = money(total);
  if (!entries.length) {
    $("#cartItems").innerHTML = `<div class="empty-cart"><span>🛒</span><h3>Your bag is waiting</h3><p>Add something delicious from our collection.</p><button class="btn btn-primary" id="continueShopping">Explore products</button></div>`;
    $("#cartSummary").style.display = "none";
  } else {
    $("#cartSummary").style.display = "block";
    $("#cartItems").innerHTML = entries.map(([id, qty]) => {
      const p = productById(id);
      return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><div class="item-price">${money(p.price)} / ${p.pack || "pack"}</div><div class="qty-control"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><div><strong>${money(p.price*qty)}</strong><br><button class="remove-item" data-remove="${id}">Remove</button></div></div>`;
    }).join("");
  }
}
function openCart() {
  $("#cartOverlay").classList.add("open"); $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
}
function closeCart() {
  $("#cartOverlay").classList.remove("open"); $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true"); document.body.style.overflow="";
}
function showToast(message) {
  const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function sendWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  const qty = e.target.closest("[data-qty]");
  const remove = e.target.closest("[data-remove]");
  const filter = e.target.closest("[data-filter]");
  if (add) addToCart(add.dataset.add);
  if (qty) changeQty(qty.dataset.qty, Number(qty.dataset.delta));
  if (remove) { delete cart[remove.dataset.remove]; renderCart(); }
  if (filter) {
    currentFilter = filter.dataset.filter;
    $$(".filter").forEach(b => b.classList.toggle("active", b === filter));
    renderProducts();
  }
  if (e.target.closest("#continueShopping")) { closeCart(); $("#shop").scrollIntoView({behavior:"smooth"}); }
});
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartOverlay").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });
$("#checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const entries = Object.entries(cart).filter(([id, qty]) => productById(id) && qty > 0);
  if (!entries.length) { showToast("Your cart is empty."); return; }
  const fd = new FormData(e.currentTarget);
  const total = entries.reduce((sum, [id, qty]) => sum + productById(id).price * qty, 0);
  const lines = entries.map(([id, qty]) => {
    const p = productById(id);
    return `• ${p.name} (${p.pack || "pack"}) × ${qty} = ${money(p.price * qty)}`;
  });
  const message = [
    "🌾 *GRAINORA — NEW ORDER*",
    "Purani Parampara, Nayi Sehat",
    "",
    "*Customer details*",
    `Name: ${fd.get("customerName")}`,
    `Phone: ${fd.get("customerPhone")}`,
    `Address: ${fd.get("customerAddress")}`,
    "",
    "*Order items*",
    ...lines,
    "",
    `*Subtotal: ${money(total)}*`,
    "Delivery charges / availability: please confirm.",
    `Order note: ${fd.get("customerNote") || "None"}`,
    "",
    "Please confirm my order. Thank you!"
  ].join("\n");
  sendWhatsApp(message);
});
$("#footerWhatsApp").addEventListener("click", () => sendWhatsApp("Hello Grainora! I would like to know more about your products."));
$("#floatingWhatsApp").addEventListener("click", e => { e.preventDefault(); sendWhatsApp("Hello Grainora! I would like to know more about your products."); });
$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$('#mainNav a').forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));
$("#year").textContent = new Date().getFullYear();

renderProducts(); renderCart();
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold:0.12});
  $$(".reveal").forEach(el => observer.observe(el));
} else $$(".reveal").forEach(el => el.classList.add("visible"));
