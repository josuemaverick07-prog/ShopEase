document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Log in / sign up (demo only, nothing is saved) ---------- */
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const message = document.getElementById("message");

  const showMessage = (text, type) => {
    message.textContent = text;
    message.className = text ? `is-${type}` : "";
  };

  const showForm = (which) => {
    loginBox.hidden = which !== "login";
    signupBox.hidden = which !== "signup";
    showMessage("");
  };

  document.getElementById("showSignup").addEventListener("click", (event) => {
    event.preventDefault();
    showForm("signup");
  });

  document.getElementById("showLogin").addEventListener("click", (event) => {
    event.preventDefault();
    showForm("login");
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(loginForm).get("email").trim();
    showMessage(`Welcome back, ${email}!`, "success");
    loginForm.reset();
  });

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(signupForm).get("name").trim();
    signupForm.reset();
    showForm("login");
    showMessage(`Account created for ${name}! You can log in now.`, "success");
  });

  /* ---------- Cart ---------- */
  const cartCount = document.querySelector("[data-cart-count]");
  const cartToggle = document.querySelector(".cart-toggle");
  const cartClose = document.querySelector(".cart-close");
  const cartPanel = document.getElementById("cartPanel");
  const cartItems = document.querySelector("[data-cart-items]");
  const cartEmpty = document.querySelector("[data-cart-empty]");
  const cartTotal = document.querySelector("[data-cart-total]");
  const cart = new Map(); // product name -> { price, quantity }

  const formatPeso = (amount) => `₱${amount.toLocaleString("en-PH")}`;

  const renderCart = () => {
    let count = 0;
    let total = 0;

    cartItems.replaceChildren();

    cart.forEach((item, name) => {
      count += item.quantity;
      total += item.price * item.quantity;

      const row = document.createElement("li");
      row.className = "cart-item";

      const description = document.createElement("span");
      description.textContent = `${name} × ${item.quantity} — ${formatPeso(item.price * item.quantity)}`;

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "cart-remove";
      removeButton.dataset.removeCart = name;
      removeButton.textContent = "Remove";
      removeButton.setAttribute("aria-label", `Remove ${name} from cart`);

      row.append(description, removeButton);
      cartItems.append(row);
    });

    cartCount.textContent = String(count);
    cartEmpty.hidden = cart.size > 0;
    cartTotal.textContent = formatPeso(total);
  };

  const setCartOpen = (isOpen) => {
    cartPanel.hidden = !isOpen;
    cartToggle.setAttribute("aria-expanded", String(isOpen));
    cartToggle.setAttribute("aria-label", isOpen ? "Close shopping cart" : "Open shopping cart");
  };

  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const info = button.closest(".product-info");
      const name = info.querySelector("h4").textContent.trim();
      const price = Number(info.querySelector("p").textContent.replace(/[^\d]/g, ""));

      if (!name || !price) {
        return;
      }

      const item = cart.get(name);
      if (item) {
        item.quantity += 1;
      } else {
        cart.set(name, { price, quantity: 1 });
      }
      renderCart();

      const originalText = button.textContent;
      button.textContent = "Added";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 900);
    });
  });

  cartToggle.addEventListener("click", () => setCartOpen(cartPanel.hidden));
  cartClose.addEventListener("click", () => setCartOpen(false));

  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-cart]");
    if (removeButton) {
      cart.delete(removeButton.dataset.removeCart);
      renderCart();
    }
  });

  document.addEventListener("click", (event) => {
    if (!cartPanel.contains(event.target) && !cartToggle.contains(event.target)) {
      setCartOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCartOpen(false);
    }
  });

  renderCart();
});
