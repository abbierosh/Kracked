"use strict";

const SHOP_CONFIG = {
  STORAGE_CART_KEY: "krackedShopTestCart",
  STORAGE_ORDERS_KEY: "krackedShopTestOrders",
  DELIVERY_FEE: 5,
  FREE_DELIVERY_THRESHOLD: 50,
  PAYNOW_RECIPIENT: "KRacked PayNow recipient placeholder",
  WHATSAPP_NUMBER: "6500000000", // TODO: replace with real KRacked WhatsApp number.
  TAKE_APP_FALLBACK: "https://take.app/krackedbakes"
};

let products = [];
let cart = {};
let activeCategory = "All";
let promoCode = "";
let checkoutCustomer = null;
let pendingOrder = null;
let lastFocusedElement = null;

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function loadProducts() {
  products = [
    {
      id: "hot_cocoa_cookies",
      name: "Hot Cocoa Cookies",
      packSize: "Box of 6",
      price: 13.90,
      priceLabel: "$13.90",
      category: "Cookies",
      moodTags: ["dark", "cocoa", "soft-centre", "comfort"],
      shortDescription: "Deep cocoa cookies with soft hot-cocoa energy.",
      fullDescription: "Deep cocoa cookies with a soft-centre profile and dark comfort energy for proper chocolate people.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Preorder test item. Timing will be confirmed after payment verification.",
      image: "https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:640/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcmmonmbi0000104kz7p8477pj.jpeg",
      fallbackUrl: "https://take.app/krackedbakes/p/cmmmexc6h000104juop7cfe8i"
    },
    {
      id: "brookies",
      name: "Brookies",
      packSize: "Box of 8",
      price: 18.90,
      priceLabel: "$18.90",
      category: "Hybrid bakes",
      moodTags: ["chocolate", "brownie", "cookie", "rich", "wildcard"],
      shortDescription: "Brownie density meets cookie chew.",
      fullDescription: "Brownie density meets cookie chew in a rich hybrid bake built for the indecisive chocolate mood.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Preorder test item. Timing will be confirmed after payment verification.",
      image: "https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:640/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcmmonns8c000104js0hgf8so5.jpeg",
      fallbackUrl: "https://take.app/krackedbakes/p/cmmmeuznz001104lbet8awdc9"
    },
    {
      id: "tiramisu_rolls",
      name: "Tiramisu Rolls",
      packSize: "Set of 3",
      price: 12.90,
      priceLabel: "$12.90",
      category: "Rolls",
      moodTags: ["coffee", "cream", "cocoa", "soft"],
      shortDescription: "Coffee-led rolls with cream and cocoa dust energy.",
      fullDescription: "Coffee-led rolls layered with cream and cocoa dust energy. Soft, moody, and not trying to be cute.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Preorder test item. Timing will be confirmed after payment verification.",
      image: "https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:640/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcmmono9vx000104l45e194ert.jpeg",
      fallbackUrl: "https://take.app/krackedbakes/p/cmmmesaaz000i04l14yc3kebn"
    },
    {
      id: "french_brioche_loaf",
      name: "French Brioche Loaf",
      packSize: "1 loaf",
      price: 14.90,
      priceLabel: "$14.90",
      category: "Brioche",
      moodTags: ["buttery", "soft", "comfort"],
      shortDescription: "Soft butter-forward loaf for slow mornings and snacky slices.",
      fullDescription: "Soft butter-forward loaf for slow mornings, snacky slices, and the kind of bread you keep returning to.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Preorder test item. Timing will be confirmed after payment verification.",
      image: "https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:640/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcmmonn1sh000004l42u2dgqqc.jpeg",
      fallbackUrl: "https://take.app/krackedbakes/p/cmmmew9md001m04jujtgqqz4l"
    },
    {
      id: "streuseltalers",
      name: "Streuseltalers",
      packSize: "Menu item",
      price: 14.90,
      priceLabel: "$14.90 test placeholder",
      category: "Crumble",
      moodTags: ["lemon", "blueberry", "crumble", "bright"],
      shortDescription: "Bright fruit and crumble texture in a pastry-style bake.",
      fullDescription: "Bright lemon-blueberry fruit and crumble texture in a pastry-style bake with a cleaner edge.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Placeholder price used for this isolated checkout test.",
      image: "https://emofly.b-cdn.net/hbd_exvhac6ayb3ZKT/width:640/plain/https%3A%2F%2Fstorage.googleapis.com%2Ftakeapp%2Fmedia%2Fcmpi029ie00000bkm4si24eqo.png",
      fallbackUrl: "https://take.app/krackedbakes/p/cmpi02d5j00000bji89ahs4wu"
    },
    {
      id: "garlic_shio_pan",
      name: "Garlic Butter Cream Cheese Shio Pan",
      packSize: "Menu item",
      price: null,
      priceLabel: "Menu price",
      category: "Savoury",
      moodTags: ["butter", "salt", "cream cheese", "savoury"],
      shortDescription: "Buttery, salty, savoury comfort with a soft pull.",
      fullDescription: "Buttery, salty, savoury comfort with a soft pull and cream cheese richness.",
      allergens: "Allergen placeholder: may contain gluten, dairy, eggs, soy, nuts, and other common bakery allergens.",
      availability: "Menu price not configured in this repo yet. Add a real price before enabling checkout.",
      image: "",
      fallbackUrl: SHOP_CONFIG.TAKE_APP_FALLBACK
    }
  ];

  return products;
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function getCartItems() {
  return Object.entries(cart)
    .map(([productId, qty]) => ({ product: getProduct(productId), qty }))
    .filter((entry) => entry.product && entry.qty > 0);
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const filter = document.getElementById("categoryFilter");
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  filter.innerHTML = categories.map((category) => `
    <button class="filter-button ${category === activeCategory ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">
      ${escapeHtml(category)}
    </button>
  `).join("");

  const visibleProducts = activeCategory === "All"
    ? products
    : products.filter((product) => product.category === activeCategory);

  grid.innerHTML = visibleProducts.map((product) => {
    const quantity = cart[product.id] || 1;
    const hasPrice = typeof product.price === "number";
    return `
      <article class="product-card">
        <button class="product-visual" type="button" data-product-detail="${product.id}" aria-label="View ${escapeHtml(product.name)} details">
          ${product.image ? `<img src="${product.image}" alt="" loading="lazy">` : `<span class="product-fallback">KRacked editorial placeholder</span>`}
        </button>
        <div class="product-body">
          <div class="product-top">
            <div>
              <h3>${escapeHtml(product.name)}</h3>
              <p class="pack">${escapeHtml(product.packSize)}</p>
            </div>
            <p class="price">${escapeHtml(product.priceLabel)}</p>
          </div>
          <p class="description">${escapeHtml(product.shortDescription)}</p>
          <div class="tags">${product.moodTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="card-actions">
            <div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)}">
              <button type="button" data-product-card-dec="${product.id}" ${!hasPrice ? "disabled" : ""}>−</button>
              <span id="cardQty-${product.id}">${quantity}</span>
              <button type="button" data-product-card-inc="${product.id}" ${!hasPrice ? "disabled" : ""}>+</button>
            </div>
            <button class="button primary" type="button" data-add-product="${product.id}" ${!hasPrice ? "disabled" : ""}>
              ${hasPrice ? "Add to cart" : "Price pending"}
            </button>
            <button class="link-button" type="button" data-product-detail="${product.id}">View details</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openProductDetail(productId) {
  const product = getProduct(productId);
  if (!product) return;

  lastFocusedElement = document.activeElement;
  const modal = document.getElementById("productModal");
  const content = document.getElementById("productModalContent");
  const hasPrice = typeof product.price === "number";
  const quantity = cart[product.id] || 1;

  content.innerHTML = `
    <div class="modal-product">
      <div class="product-visual">
        ${product.image ? `<img src="${product.image}" alt="">` : `<span class="product-fallback">KRacked editorial placeholder</span>`}
      </div>
      <div class="modal-copy">
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <h2 id="modalProductTitle">${escapeHtml(product.name)}</h2>
        <p class="pack">${escapeHtml(product.packSize)} · <strong class="price">${escapeHtml(product.priceLabel)}</strong></p>
        <p class="description">${escapeHtml(product.fullDescription)}</p>
        <div class="tags">${product.moodTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <p class="trust-note">${escapeHtml(product.allergens)}</p>
        <p class="trust-note">${escapeHtml(product.availability)}</p>
        <div class="card-actions">
          <div class="quantity-control">
            <button type="button" data-product-card-dec="${product.id}" ${!hasPrice ? "disabled" : ""}>−</button>
            <span id="modalQty-${product.id}">${quantity}</span>
            <button type="button" data-product-card-inc="${product.id}" ${!hasPrice ? "disabled" : ""}>+</button>
          </div>
          <button class="button primary" type="button" data-add-product="${product.id}" ${!hasPrice ? "disabled" : ""}>
            ${hasPrice ? "Add to cart" : "Price pending"}
          </button>
          <a class="button ghost" href="${escapeHtml(product.fallbackUrl)}" target="_blank" rel="noopener">Take.app fallback</a>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-card").focus();
}

function closeProductDetail() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function persistCart() {
  localStorage.setItem(SHOP_CONFIG.STORAGE_CART_KEY, JSON.stringify(cart));
}

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(SHOP_CONFIG.STORAGE_CART_KEY)) || {};
  } catch {
    cart = {};
  }
}

function addToCart(productId, qty = 1) {
  const product = getProduct(productId);
  if (!product || typeof product.price !== "number") return;
  cart[productId] = Math.max(1, (cart[productId] || 0) + Number(qty || 1));
  persistCart();
  renderProducts();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  persistCart();
  renderProducts();
  renderCart();
}

function updateQuantity(productId, qty) {
  const nextQty = Number(qty);
  if (!Number.isFinite(nextQty) || nextQty <= 0) {
    removeFromCart(productId);
    return;
  }
  cart[productId] = Math.min(99, Math.floor(nextQty));
  persistCart();
  renderProducts();
  renderCart();
}

function calculateSubtotal() {
  return getCartItems().reduce((total, item) => total + item.product.price * item.qty, 0);
}

function calculateDeliveryFee() {
  const fulfilment = document.querySelector("input[name='fulfilmentType']:checked")?.value || checkoutCustomer?.fulfilmentType || "collection";
  const subtotal = calculateSubtotal();
  if (fulfilment !== "delivery") return 0;
  return subtotal >= SHOP_CONFIG.FREE_DELIVERY_THRESHOLD ? 0 : SHOP_CONFIG.DELIVERY_FEE;
}

function validatePromoCode(codeValue) {
  const code = String(codeValue ?? promoCode).trim().toUpperCase();
  if (!code) return { valid: false, code: "", message: "" };
  const match = /^KRACK5-(\d{3})$/.exec(code);
  const number = match ? Number(match[1]) : 0;
  if (match && number >= 1 && number <= 50) {
    return { valid: true, code, message: "Test code accepted. Code validity will be confirmed before launch." };
  }
  return { valid: false, code, message: "Invalid test code. Try KRACK5-001 to KRACK5-050." };
}

function calculateDiscount() {
  const promo = validatePromoCode();
  return promo.valid ? calculateSubtotal() * 0.05 : 0;
}

function calculateTotal() {
  return Math.max(0, calculateSubtotal() - calculateDiscount() + calculateDeliveryFee());
}

function renderCart() {
  const cartContent = document.getElementById("cartContent");
  const drawerContent = document.getElementById("drawerCartContent");
  const html = buildCartHtml();
  cartContent.innerHTML = html;
  drawerContent.innerHTML = html;

  const count = getCartItems().reduce((total, item) => total + item.qty, 0);
  document.getElementById("headerCartCount").textContent = count;
  document.getElementById("mobileCartCount").textContent = count;
  document.getElementById("mobileCartTotal").textContent = money(calculateTotal());
}

function buildCartHtml() {
  const items = getCartItems();
  const promo = validatePromoCode();
  const discount = calculateDiscount();
  const deliveryFee = calculateDeliveryFee();
  const checkoutDisabled = items.length === 0 ? "disabled" : "";

  if (!items.length) {
    return `
      <p class="empty-cart">Your box is still empty.<br>Add a bake to start kracking.</p>
      <button class="button primary wide" type="button" disabled>Continue to details</button>
    `;
  }

  return `
    <ul class="cart-list">
      ${items.map(({ product, qty }) => `
        <li class="cart-item">
          <div class="cart-item-title">
            <span>${escapeHtml(product.name)}</span>
            <span>${money(product.price * qty)}</span>
          </div>
          <small>${escapeHtml(product.packSize)} · ${money(product.price)} each</small>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button type="button" data-cart-dec="${product.id}">−</button>
              <span>${qty}</span>
              <button type="button" data-cart-inc="${product.id}">+</button>
            </div>
            <button class="link-button" type="button" data-remove-product="${product.id}">Remove</button>
          </div>
        </li>
      `).join("")}
    </ul>
    <div class="promo-box">
      <label>Promo code <span class="optional">test only</span>
        <input data-promo-code value="${escapeHtml(promo.code)}" placeholder="KRACK5-001" autocomplete="off">
      </label>
      <span class="promo-message ${promo.valid ? "ok" : ""}">${escapeHtml(promo.message)}</span>
    </div>
    <div class="totals">
      <div class="total-line"><span>Subtotal</span><strong>${money(calculateSubtotal())}</strong></div>
      ${discount ? `<div class="total-line"><span>Test code discount</span><strong>−${money(discount)}</strong></div>` : ""}
      <div class="total-line"><span>Delivery fee</span><strong>${money(deliveryFee)}</strong></div>
      <div class="total-line strong"><span>Total</span><strong>${money(calculateTotal())}</strong></div>
    </div>
    <p class="cart-note">Payment is manual. KRacked will confirm once payment is checked.</p>
    <button class="button primary wide" type="button" data-proceed-checkout ${checkoutDisabled}>Continue to details</button>
  `;
}

function openCart() {
  lastFocusedElement = document.activeElement;
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
  drawer.querySelector(".drawer-sheet").focus();
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function proceedToCheckout() {
  if (!getCartItems().length) return;
  closeCart();
  document.getElementById("checkout").hidden = false;
  document.getElementById("checkout").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateCustomerDetails() {
  const form = document.getElementById("checkoutForm");
  const data = new FormData(form);
  const errors = {};
  const fulfilmentType = data.get("fulfilmentType");
  const preferredDate = data.get("preferredDate");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!data.get("name")?.trim()) errors.name = "Name is required.";
  if (!data.get("phone")?.trim()) errors.phone = "Phone number is required.";
  if (!fulfilmentType) errors.fulfilmentType = "Choose self-collection or delivery.";
  if (!preferredDate) {
    errors.preferredDate = "Preferred date is required.";
  } else {
    const chosen = new Date(`${preferredDate}T00:00:00`);
    if (chosen < today) errors.preferredDate = "Preferred date cannot be in the past.";
  }
  if (!data.get("preferredTime")) errors.preferredTime = "Choose a preferred time window.";
  if (fulfilmentType === "delivery") {
    if (!data.get("address")?.trim()) errors.address = "Delivery address is required.";
    if (!data.get("postalCode")?.trim()) errors.postalCode = "Postal code is required.";
  }

  document.querySelectorAll(".field-error").forEach((node) => {
    node.textContent = errors[node.dataset.errorFor] || "";
  });

  if (Object.keys(errors).length) return null;

  checkoutCustomer = {
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    instagramHandle: data.get("instagramHandle").trim(),
    fulfilmentType,
    address: fulfilmentType === "delivery" ? data.get("address").trim() : "",
    postalCode: fulfilmentType === "delivery" ? data.get("postalCode").trim() : "",
    preferredDate,
    preferredTime: data.get("preferredTime"),
    notes: data.get("notes").trim(),
    allergies: data.get("allergies").trim()
  };

  return checkoutCustomer;
}

function generateOrderId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `KRK-${yyyy}${mm}${dd}-${suffix}`;
}

function buildOrderPayload() {
  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee();
  const discount = calculateDiscount();
  const promo = validatePromoCode();
  return {
    orderId: pendingOrder?.orderId || generateOrderId(),
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    items: getCartItems().map(({ product, qty }) => ({
      productId: product.id,
      name: product.name,
      packSize: product.packSize,
      unitPrice: product.price,
      quantity: qty,
      subtotal: product.price * qty
    })),
    subtotal,
    deliveryFee,
    discount,
    promoCode: promo.valid ? promo.code : "",
    total: Math.max(0, subtotal - discount + deliveryFee),
    customer: checkoutCustomer,
    payment: {
      method: "PayNow",
      verificationStatus: "pending",
      proofMethod: "WhatsApp/IG"
    },
    source: "kracked-shop-test"
  };
}

function saveOrder(order) {
  // TODO Option A: POST this payload to a Google Sheets Apps Script endpoint.
  // TODO Option B: Send it to a Cloudflare Pages Function that writes to D1.
  // TODO Option C: Insert it into a Supabase table with server-side credentials.
  // Do not hardcode secrets or tokens in this static file.
  return saveOrderLocal(order);
}

function saveOrderLocal(order) {
  const orders = getOrderHistoryLocal();
  orders.push(order);
  localStorage.setItem(SHOP_CONFIG.STORAGE_ORDERS_KEY, JSON.stringify(orders));
  return order;
}

function getOrderHistoryLocal() {
  try {
    const orders = JSON.parse(localStorage.getItem(SHOP_CONFIG.STORAGE_ORDERS_KEY)) || [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function clearCartAfterSubmit() {
  cart = {};
  persistCart();
  renderProducts();
  renderCart();
}

function exportOrdersAsJson() {
  return JSON.stringify(getOrderHistoryLocal(), null, 2);
}

function exportOrdersAsCsv() {
  const rows = getOrderHistoryLocal();
  const headers = ["orderId", "createdAt", "status", "name", "phone", "fulfilmentType", "items", "subtotal", "deliveryFee", "discount", "total", "paymentStatus"];
  const csvRows = [headers.join(",")];
  rows.forEach((order) => {
    const values = [
      order.orderId,
      order.createdAt,
      order.status,
      order.customer?.name,
      order.customer?.phone,
      order.customer?.fulfilmentType,
      order.items?.map((item) => `${item.quantity}x ${item.name}`).join("; "),
      order.subtotal,
      order.deliveryFee,
      order.discount,
      order.total,
      order.payment?.verificationStatus
    ].map((value) => `"${String(value ?? "").replace(/"/g, "\"\"")}"`);
    csvRows.push(values.join(","));
  });
  return csvRows.join("\n");
}

function buildOrderSummaryText(order) {
  const items = order.items.map((item) => `${item.quantity}x ${item.name} — ${money(item.subtotal)}`).join("\n");
  const fulfilment = order.customer.fulfilmentType === "delivery" ? "Delivery" : "Self-collection";
  return `KRacked order ${order.orderId}
Status: Pending payment verification

Items:
${items}

Total: ${money(order.total)}
Fulfilment: ${fulfilment}
Preferred: ${order.customer.preferredDate}, ${order.customer.preferredTime}

Payment proof to be sent separately.`;
}

function copyToClipboardWithFallback(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function buildWhatsAppUrl(order) {
  const message = `${buildOrderSummaryText(order)}

Payment screenshot attached separately.`;
  return `https://wa.me/${SHOP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showPaymentStep() {
  pendingOrder = buildOrderPayload();
  document.getElementById("payment").hidden = false;
  document.getElementById("paymentContent").innerHTML = `
    <div class="payment-layout">
      <div class="paynow-box">
        <p class="status-pill">Order received, payment pending</p>
        <h3>Order ID: ${escapeHtml(pendingOrder.orderId)}</h3>
        <p class="description">Payment is manual for now.</p>
        <p>Please PayNow the exact total shown below. Include your order ID in the payment reference if your bank app allows it. Then send us your payment screenshot on WhatsApp or IG. Your order is only confirmed after KRacked checks the payment.</p>
        <p class="trust-note">Please verify the recipient name in your banking app before sending payment. KRacked does not collect card details on this site.</p>
        <div class="totals">
          <div class="total-line strong"><span>Exact total</span><strong>${money(pendingOrder.total)}</strong></div>
          <div class="total-line"><span>PayNow recipient</span><strong>${escapeHtml(SHOP_CONFIG.PAYNOW_RECIPIENT)}</strong></div>
        </div>
        <div class="inline-actions">
          <button class="button ghost" type="button" data-copy-total>Copy total</button>
          <button class="button ghost" type="button" data-copy-order-id>Copy order ID</button>
          <button class="button ghost" type="button" data-copy-payment>Copy payment instructions</button>
        </div>
        <button class="button primary wide" type="button" data-submit-order>Submit order for verification</button>
      </div>
      <aside class="summary-box">
        <div class="qr-placeholder">PAYNOW QR PLACEHOLDER<br>Replace with real QR before launch.</div>
        ${buildSummaryHtml(pendingOrder)}
      </aside>
    </div>
  `;
  document.getElementById("payment").scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildSummaryHtml(order) {
  return `
    <h3>Order summary</h3>
    <ul class="cart-list">
      ${order.items.map((item) => `
        <li class="cart-item">
          <div class="cart-item-title"><span>${item.quantity}x ${escapeHtml(item.name)}</span><span>${money(item.subtotal)}</span></div>
          <small>${escapeHtml(item.packSize)}</small>
        </li>
      `).join("")}
    </ul>
    <div class="totals">
      <div class="total-line"><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div>
      ${order.discount ? `<div class="total-line"><span>Test code discount</span><strong>−${money(order.discount)}</strong></div>` : ""}
      <div class="total-line"><span>Delivery fee</span><strong>${money(order.deliveryFee)}</strong></div>
      <div class="total-line strong"><span>Total</span><strong>${money(order.total)}</strong></div>
    </div>
  `;
}

function showConfirmation(order) {
  document.getElementById("confirmation").hidden = false;
  document.getElementById("confirmationContent").innerHTML = `
    <div class="confirmation-layout">
      <div class="paynow-box">
        <p class="status-pill">Pending payment verification</p>
        <p>We’ve saved your order details in this test flow. Please send your payment screenshot to KRacked so we can verify and confirm your order.</p>
        <div class="totals">
          <div class="total-line"><span>Order ID</span><strong>${escapeHtml(order.orderId)}</strong></div>
          <div class="total-line"><span>Name</span><strong>${escapeHtml(order.customer.name)}</strong></div>
          <div class="total-line"><span>Fulfilment</span><strong>${order.customer.fulfilmentType === "delivery" ? "Delivery" : "Self-collection"}</strong></div>
          <div class="total-line"><span>Payment status</span><strong>Pending verification</strong></div>
        </div>
        <div class="inline-actions">
          <button class="button ghost" type="button" data-copy-summary>Copy order summary</button>
          <a class="button primary" href="${buildWhatsAppUrl(order)}" target="_blank" rel="noopener">Message KRacked on WhatsApp</a>
          <a class="button ghost" href="#products">Back to shop</a>
          <button class="button ghost" type="button" data-reset-shop>Start new order</button>
        </div>
      </div>
      <aside class="summary-box">${buildSummaryHtml(order)}</aside>
    </div>
  `;
  document.getElementById("confirmation").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetShop() {
  pendingOrder = null;
  checkoutCustomer = null;
  document.getElementById("checkoutForm").reset();
  document.getElementById("deliveryFields").hidden = true;
  document.getElementById("checkout").hidden = true;
  document.getElementById("payment").hidden = true;
  document.getElementById("confirmation").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleClick(event) {
  const target = event.target.closest("button, a, [data-close-cart], [data-close-product]");
  if (!target) return;

  if (target.matches("[data-open-cart]")) openCart();
  if (target.matches("[data-close-cart]")) closeCart();
  if (target.matches("[data-close-product]")) closeProductDetail();
  if (target.dataset.category) {
    activeCategory = target.dataset.category;
    renderProducts();
  }
  if (target.dataset.productDetail) openProductDetail(target.dataset.productDetail);
  if (target.dataset.productCardInc) {
    const id = target.dataset.productCardInc;
    const current = Number(document.getElementById(`cardQty-${id}`)?.textContent || document.getElementById(`modalQty-${id}`)?.textContent || 1);
    document.querySelectorAll(`#cardQty-${id}, #modalQty-${id}`).forEach((node) => { node.textContent = current + 1; });
  }
  if (target.dataset.productCardDec) {
    const id = target.dataset.productCardDec;
    const current = Number(document.getElementById(`cardQty-${id}`)?.textContent || document.getElementById(`modalQty-${id}`)?.textContent || 1);
    const next = Math.max(1, current - 1);
    document.querySelectorAll(`#cardQty-${id}, #modalQty-${id}`).forEach((node) => { node.textContent = next; });
  }
  if (target.dataset.addProduct) {
    const id = target.dataset.addProduct;
    const qty = Number(document.getElementById(`modalQty-${id}`)?.textContent || document.getElementById(`cardQty-${id}`)?.textContent || 1);
    addToCart(id, qty);
  }
  if (target.dataset.cartInc) updateQuantity(target.dataset.cartInc, (cart[target.dataset.cartInc] || 0) + 1);
  if (target.dataset.cartDec) updateQuantity(target.dataset.cartDec, (cart[target.dataset.cartDec] || 0) - 1);
  if (target.dataset.removeProduct) removeFromCart(target.dataset.removeProduct);
  if (target.matches("[data-proceed-checkout]")) proceedToCheckout();
  if (target.matches("[data-copy-total]")) copyToClipboardWithFallback(money(pendingOrder.total));
  if (target.matches("[data-copy-order-id]")) copyToClipboardWithFallback(pendingOrder.orderId);
  if (target.matches("[data-copy-payment]")) copyToClipboardWithFallback(`PayNow ${money(pendingOrder.total)} to ${SHOP_CONFIG.PAYNOW_RECIPIENT}. Reference: ${pendingOrder.orderId}. Send payment proof via WhatsApp/IG.`);
  if (target.matches("[data-submit-order]")) {
    const saved = saveOrder(pendingOrder);
    clearCartAfterSubmit();
    showConfirmation(saved);
  }
  if (target.matches("[data-copy-summary]")) copyToClipboardWithFallback(buildOrderSummaryText(pendingOrder));
  if (target.matches("[data-reset-shop]")) resetShop();
}

function initShop() {
  loadProducts();
  loadCart();
  renderProducts();
  renderCart();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  document.getElementById("preferredDate").min = today.toISOString().slice(0, 10);

  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeProductDetail();
    }
  });

  document.addEventListener("input", (event) => {
    if (event.target.matches("[data-promo-code]")) {
      promoCode = event.target.value;
      renderCart();
    }
  });

  document.querySelectorAll("input[name='fulfilmentType']").forEach((radio) => {
    radio.addEventListener("change", () => {
      document.getElementById("deliveryFields").hidden = radio.value !== "delivery" || !radio.checked;
      renderCart();
    });
  });

  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (validateCustomerDetails()) showPaymentStep();
  });

  document.getElementById("exportJsonButton").addEventListener("click", () => {
    document.getElementById("adminOutput").textContent = exportOrdersAsJson();
  });
  document.getElementById("exportCsvButton").addEventListener("click", () => {
    document.getElementById("adminOutput").textContent = exportOrdersAsCsv();
  });

  window.KRackedShopTest = {
    saveOrderLocal,
    getOrderHistoryLocal,
    exportOrdersAsJson,
    exportOrdersAsCsv,
    resetShop
  };
}

document.addEventListener("DOMContentLoaded", initShop);
