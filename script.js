// ======== Product Data ========
let products = [
    { name: "Indie Look", category: "Women", price: 1200, rating: 4, img: "Indie-girl.jpg", desc: "Unleash your inner vibes with this unique outfit." },
    { name: "Summer Breeze", category: "Women", price: 900, rating: 5, img: "pexels-prayoon-sajeev-1486107-2897531.jpg", desc: "Feel light and fresh this summer with pastel shades." },
    { name: "Street Casual", category: "Men", price: 1100, rating: 3, img: "IMG-20250318-WA0021.jpg", desc: "Trendy. Tough. Timeless. Make a bold street-style statement." },
    { name: "Kids Playful", category: "Kids", price: 700, rating: 4, img: "kids-outfit.jpg", desc: "Fun and comfy for kids on the move." },
];

// ======== DOM Elements ========
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.getElementById("categoryButtons");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ======== Cart Array ========
let cartArray = JSON.parse(localStorage.getItem('cart')) || [];

// ======== Functions ========

// Generate Filter Buttons dynamically
function renderFilterButtons() {
    const categories = ["All", ...new Set(products.map(p => p.category))];
    categoryButtons.innerHTML = "";
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.className = "nav-item";
        li.innerHTML = `<a class="nav-link" href="#">${cat}</a>`;
        li.addEventListener("click", () => filterProducts(cat));
        categoryButtons.appendChild(li);
    });
}

// Render Products
function renderProducts(list) {
    productContainer.innerHTML = "";
    list.forEach(product => {
        const stars = "&#9733;".repeat(product.rating) + "&#9734;".repeat(5 - product.rating);
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.setAttribute("data-aos", "fade-up");
        col.innerHTML = `
            <div class="card h-100">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <div class="text-warning">${stars}</div>
                    <p class="card-text">${product.desc}</p>
                    <p class="fw-bold">₹${product.price}</p>
                    <button class="btn btn-dark w-100 buy-btn">Buy</button>
                </div>
            </div>
        `;
        productContainer.appendChild(col);
    });
    AOS.refresh();
}

// Filter Products
function filterProducts(category) {
    if (category === "All") renderProducts(products);
    else renderProducts(products.filter(p => p.category === category));
}

// Search Products
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
});

// Add to Cart
document.addEventListener("click", e => {
    // Buy button
    if (e.target.classList.contains("buy-btn")) {
        const name = e.target.closest(".card-body").querySelector(".card-title").textContent;
        const product = products.find(p => p.name === name);
        const existing = cartArray.find(item => item.name === name);
        if (existing) existing.qty++;
        else cartArray.push({ ...product, qty: 1 });
        saveCart();
        updateCart();
    }

    // Remove button
    if (e.target.classList.contains("remove-btn")) {
        const index = parseInt(e.target.dataset.index);
        cartArray.splice(index, 1);
        saveCart();
        updateCart();
    }
});

// Update Quantity
document.addEventListener("input", e => {
    if (e.target.classList.contains("qty-input")) {
        const index = parseInt(e.target.dataset.index);
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        cartArray[index].qty = val;
        saveCart();
        updateCart();
    }
});

// Update Cart Display
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    cartArray.forEach((item, index) => {
        total += item.price * item.qty;
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            ${item.name} - ₹${item.price} x <input type="number" class="qty-input" data-index="${index}" value="${item.qty}" min="1"> 
            <button class="remove-btn" data-index="${index}">&times;</button>
        `;
        cartItems.appendChild(div);
    });
    cartTotal.innerHTML = `Total: ₹${total}`;
    cart.style.display = cartArray.length ? "block" : "none";
}

// Save Cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartArray));
}

// Checkout
checkoutBtn.addEventListener("click", () => {
    if (!cartArray.length) return alert("Cart is empty!");
    alert(`Order placed! Total: ₹${cartArray.reduce((sum, i) => sum + i.price * i.qty, 0)}`);
    cartArray = [];
    saveCart();
    updateCart();
});

// ======== Initialize ========
renderFilterButtons();
renderProducts(products);
updateCart();
