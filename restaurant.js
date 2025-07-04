// Flip animation and cart logic
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");

  cards.forEach(card => {
    const addBtn = card.querySelector(".add-btn");
    const qtyControls = card.querySelector(".qty-controls");
    const favorite = card.querySelector(".favorite");

    // ❤️ Favorite Toggle
    if (favorite) {
      favorite.addEventListener("click", () => {
        favorite.classList.toggle("active");
        showToast("Added to Favorites");
      });
    }

    // 🛒 Add to Cart Flip
    addBtn.addEventListener("click", () => {
  card.classList.add("flipped");
  setTimeout(() => {
    card.classList.remove("flipped");
    addBtn.style.display = "none";
    qtyControls.style.display = "flex";
  }, 600);

  // Get item details from the card
  const item = {
    name: card.querySelector("h3").textContent,
    price: 49, // Or extract actual price if available
    qty: 1,
    image: card.querySelector("img").src
  };

  addToCart(item);
  showToast("Added to Cart");
});

    // ➕➖ Quantity controls
    const increaseBtn = qtyControls.querySelector(".qty-increase");
    const decreaseBtn = qtyControls.querySelector(".qty-decrease");
    const qtySpan = qtyControls.querySelector(".qty");

    increaseBtn.addEventListener("click", () => {
      let qty = parseInt(qtySpan.textContent);
      qtySpan.textContent = ++qty;
    });

    decreaseBtn.addEventListener("click", () => {
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qtySpan.textContent = --qty;
      } else {
        qtyControls.style.display = "none";
        addBtn.style.display = "inline-block";
      }
    });
  });
});

// Toast system
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.style.display = "none", 300);
  }, 2000);
}
// search
// Real-time Search Filtering
const searchInput = document.getElementById("menuSearch");
const noResults = document.getElementById("noResults");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const allCards = document.querySelectorAll(".product-card");
    let anyVisible = false;

    allCards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      const desc = card.querySelector("p").textContent.toLowerCase();
      const match = name.includes(query) || desc.includes(query);
      card.style.display = match ? "block" : "none";
      if (match) anyVisible = true;
    });

    noResults.style.display = anyVisible ? "none" : "block";
  });
}

// Scroll to category section
document.querySelectorAll('[data-target]').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Toggle menu on mobile
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("active");
});

// Logout
const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
  });
}

// Add to cart on index.html (menu)
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    button.style.display = "none";

    const controls = document.createElement("div");
    controls.className = "qty-controls";
    controls.innerHTML = `
      <button class="qty-decrease">-</button>
      <span class="qty">1</span>
      <button class="qty-increase">+</button>
    `;

    button.parentElement.appendChild(controls);

    const item = {
      name: button.parentElement.querySelector("h3").textContent,
      price: 49,
      qty: 1,
      image: button.parentElement.querySelector("img").src,
    };

    addToCart(item);

    controls.querySelector(".qty-increase").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      qty++;
      qtySpan.textContent = qty;
      item.qty = qty;
      addToCart(item, true);
    });

    controls.querySelector(".qty-decrease").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qty--;
        qtySpan.textContent = qty;
        item.qty = qty;
        addToCart(item, true);
      }
    });
  });
});

// Reuse this shared function
function addToCart(item, overwrite = false) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((i) => i.name === item.name);

  if (existing) {
    if (overwrite) {
      existing.qty = item.qty;
    } else {
      existing.qty += 1;
    }
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}
