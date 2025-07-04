window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("loginModal");
  const loginBtn = document.getElementById("loginSubmit");
  const usernameInput = document.getElementById("loginUsername");
  const passwordInput = document.getElementById("loginPassword");
  const errorMsg = document.getElementById("loginError");
  const logoutLink = document.getElementById("logoutLink");

  const userRole = localStorage.getItem("userRole");
 if (!userRole) {
  // ✅ Show login modal if not logged in
  if (modal) modal.style.display = "flex";
} else {
  // ✅ Hide login modal if already logged in
  if (modal) modal.style.display = "none";
}


  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      const deliveryAccounts = [
        { username: "admin", password: "admin123" },
        { username: "ravi", password: "ravi321" },
        { username: "salma", password: "salma@45" },
      ];

      const isDelivery = deliveryAccounts.some(
        (acc) => acc.username === username && acc.password === password
      );

      if (isDelivery) {
        localStorage.setItem("userRole", "delivery");
        window.location.href = "delivery.html";
      } else if (username !== "" && password !== "") {
        localStorage.setItem("userRole", "customer");
        alert("Logged in as Customer");
        modal.style.display = "none";
      } else {
        errorMsg.style.display = "block";
      }
    });
  }

  // ✅ THIS PART FIXES LOGOUT COMPLETELY
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      showToast("Logged out successfully");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  }
});



// Hamburger toggle
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");
if (hamburger && navLinksContainer) {
  hamburger.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });
}


// hero slider

  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');
  const left = document.querySelector('.nav.left');
  const right = document.querySelector('.nav.right');
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.onclick = () => showSlide(i);
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('span');

  function showSlide(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  right.onclick = nextSlide;
  left.onclick = prevSlide;
  setInterval(nextSlide, 5000);
  showSlide(0);



// Search functionality
const search = document.getElementById("search");
const searchWrapper = document.getElementById("search-wrapper");
const searchButton = document.getElementById("search-button");
const allProducts = document.querySelectorAll(".product");
const noResult = document.getElementById("no-result");

if (search) {
  search.addEventListener("focus", () => {
    searchWrapper.style.border = "1px solid #1dbf73";
  });

  search.addEventListener("blur", () => {
    searchWrapper.style.border = "1px solid rgba(0, 0, 0, 0.276)";
  });

  function doSearch() {
    const query = search.value.toLowerCase().trim();
    let found = false;

    allProducts.forEach((product) => {
      const text = product.textContent.toLowerCase();
      if (text.includes(query)) {
        product.style.display = "";
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    noResult.style.display = found ? "none" : "block";
  }

  searchButton.addEventListener("click", doSearch);
  search.addEventListener("input", doSearch);
}

// Toggle Description
document.querySelectorAll(".toggle-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const description = arrow.closest(".menu-item").querySelector(".description");
    const isVisible = description.style.display === "block";
    description.style.display = isVisible ? "none" : "block";
    arrow.classList.toggle("rotate");
  });
});

// Add to cart on index.html control (menu)
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

    // Enable +/- control logic
    controls.querySelector(".qty-increase").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      qty++;
      qtySpan.textContent = qty;

      item.qty = qty;
      addToCart(item, true); // overwrite quantity
    });

    controls.querySelector(".qty-decrease").addEventListener("click", () => {
      const qtySpan = controls.querySelector(".qty");
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qty--;
        qtySpan.textContent = qty;

        item.qty = qty;
        addToCart(item, true); // overwrite quantity
      }
    });
  });
});

// Modified to accept overwrite (used in menu qty changes)
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


// ADDRESS SYSTEM STARTS HERE
const addressNavv = document.getElementById("addressNavv");
const addressListModal = document.getElementById("addressListModal");
const addressListContent = document.getElementById("addressListContent");
const addressModal = document.getElementById("addressModal");
const addNewAddressBtn = document.getElementById("addNewAddressBtn");
const saveAddressBtn = document.getElementById("saveAddressBtn");

if (addressNavv) {
  addressNavv.addEventListener("click", (e) => {
    e.preventDefault();

    const addressList = JSON.parse(localStorage.getItem("customerInfoList")) || [];
    addressListContent.innerHTML = "";

    if (addressList.length === 0) {
      addressListContent.innerHTML = "<p>No addresses found.</p>";
    } else {
      addressList.forEach((info, index) => {
        const isDefault = info.default ? "checked" : "";
        addressListContent.innerHTML += `
          <div class="address-card">
            <input type="radio" name="defaultAddress" value="${index}" ${isDefault} onchange="setDefaultAddress(${index})" />
            <strong>${info.name}</strong><br>
            📞 ${info.phone} | ☎️ ${info.altPhone}<br>
            ${info.area}, ${info.city}, ${info.state}, ${info.pincode}<br>
            ${info.landmark ? "📍 " + info.landmark + "<br>" : ""}
            <small>${info.locType === 'live' ? '📡 Live Location' : '📝 Manual'}</small><br>
            <button onclick="editAddress(${index})">✏️ Edit</button>
            <button onclick="deleteAddress(${index})">🗑️ Delete</button>
          </div>
        `;
      });
    }

    addressListModal.style.display = "flex";
  });
}

addNewAddressBtn.addEventListener("click", () => {
  addressListModal.style.display = "none";
  addressModal.style.display = "flex";

  document.getElementById("custName").value = "";
  document.getElementById("custPhone").value = "";
  document.getElementById("custAltPhone").value = "";
  document.getElementById("custPincode").value = "";
  document.getElementById("custState").value = "";
  document.getElementById("custCity").value = "";
  document.getElementById("custArea").value = "";
  document.getElementById("custLandmark").value = "";
  document.getElementById("custLocation").value = "";
  document.getElementById("locationType").value = "manual";

  saveAddressBtn.onclick = addNewAddress;
});

function addNewAddress() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const altPhone = document.getElementById("custAltPhone").value.trim();
  const pincode = document.getElementById("custPincode").value.trim();
  const state = document.getElementById("custState").value.trim();
  const city = document.getElementById("custCity").value.trim();
  const area = document.getElementById("custArea").value.trim();
  const landmark = document.getElementById("custLandmark").value.trim();
  const locType = document.getElementById("locationType").value;
  const location = document.getElementById("custLocation").value.trim();
  const error = document.getElementById("addressError");

  if (name && phone && pincode && state && city && area && location) {
    const info = {
      name, phone, altPhone, pincode, state, city, area, landmark, locType, location, default: false
    };

    let allAddresses = JSON.parse(localStorage.getItem("customerInfoList")) || [];
    allAddresses.push(info);
    localStorage.setItem("customerInfoList", JSON.stringify(allAddresses));

    addressModal.style.display = "none";
    showToast("Address added");
  } else {
    error.style.display = "block";
  }
}

function setDefaultAddress(index) {
  const list = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
  list.forEach((item, i) => item.default = (i === index));
  localStorage.setItem("customerInfoList", JSON.stringify(list));
  showToast("Default address updated");
}

function deleteAddress(index) {
  const list = JSON.parse(localStorage.getItem("customerInfoList") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customerInfoList", JSON.stringify(list));
  showToast("Address deleted");
  addressNavv.click();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 300);
  }, 2000);
}

const detectLocationBtn = document.getElementById("detectLocationBtn");

if (detectLocationBtn) {
  detectLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(success => {
      const { latitude, longitude } = success.coords;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
          document.getElementById("custLocation").value = data.display_name || `${latitude}, ${longitude}`;
          
          if (data.address) {
            document.getElementById("custPincode").value = data.address.postcode || "";
            document.getElementById("custState").value = data.address.state || "";
            document.getElementById("custCity").value = data.address.city || data.address.town || "";
            document.getElementById("custArea").value = data.address.suburb || data.address.village || "";
          }
        });
    }, error => {
      alert("Unable to fetch location");
    });
  });
}
// cart products display
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const product = button.closest(".product");
      const name = product.querySelector("h3").textContent.trim();
      const priceText = product.querySelector(".price").textContent;
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const image = product.querySelector("img").src;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let found = false;

      // Don't increment on add-to-cart, just ensure 1 qty if not in cart
      cart = cart.map(item => {
        if (item.name === name) {
          found = true;
          return item; // no change to qty on re-add
        }
        return item;
      });

      if (!found) {
        cart.push({ name, price, image, qty: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });



  