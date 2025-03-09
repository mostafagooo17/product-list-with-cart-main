let products = document.querySelector(".porducts"); // Fixed typo
let cartElement = document.querySelector(".elements");
let counterCart = document.querySelector(".counterCart");
let cartEmpty = document.querySelector(".cart-empty");

let cartItems = {}; // Store items in the cart

async function getData(filejson) {
  let response = await fetch(filejson);
  let data = await response.json();

  function updateCart() {
    cartElement.innerHTML = ""; // Clear cart UI

    let totalItems = Object.values(cartItems).reduce((acc, item) => acc + item.count, 0);
    let totalPrice = Object.values(cartItems).reduce((acc, item) => acc + item.count * item.price, 0);

    counterCart.textContent = `(${totalItems})`; // Update cart counter

    if (totalItems === 0) {
      cartEmpty.style.display = "block"; // Show empty cart message
    } else {
      cartEmpty.style.display = "none"; // Hide empty cart message

      Object.values(cartItems).forEach(({ name, price, count }) => {
        let cartDiv = document.createElement("div");
        cartDiv.classList.add("cart-item");
        cartDiv.setAttribute("data-id", name);
        cartDiv.innerHTML = `
          <div>
            <h3>${name}</h3>
            <p>$${price} <span class="cart-quantity">x ${count}</span></p>
          </div>
        `;
        cartElement.append(cartDiv);
      });

      // Total Price
      let totalPriceElement = document.createElement("div");
      totalPriceElement.classList.add("total-price");
      totalPriceElement.innerHTML = `Order total: <b>$${totalPrice.toFixed(2)}</b>`;
      cartElement.append(totalPriceElement);
      let logoCart=document.createElement("div");
      logoCart.classList.add("carbon");
      logoCart.innerHTML='<img src="assets/images/icon-carbon-neutral.svg"/> this is <span> carbon neutral</span> delivery';
      cartElement.append(logoCart);
      // Confirm Order Button
      let confirmOrderButton = document.createElement("button");
      confirmOrderButton.classList.add("confirm-order");
      confirmOrderButton.textContent = "Confirm Order";
      cartElement.append(confirmOrderButton);
      confirmOrderButton.addEventListener("click", () => {
        Swal.fire({
          title: "Order Confirmed!",
          text: "Your order has been placed successfully.",
          icon: "success",
          confirmButtonText: "Start New Order",
          customClass: {
            confirmButton: "custom-confirm-button", // Add custom class
          },
          allowOutsideClick: false, // Prevent closing on background click
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload(); // Reload the page when "Start New Order" is clicked
          }
        });
      });
    }
  }

  data.forEach((item) => {
    let product = document.createElement("div");
    product.classList.add("product");

    product.innerHTML = `
      <div class="image">
        <img src="${item.image.desktop}" class="product-image"/>
        <button class="btn">
          <span class="btn-text">
            <img src="../assets/images/icon-add-to-cart.svg" />
            Add to Cart
          </span>
          <div class="counter" style="display: none;">
            <span class="increment">
              <img src="../assets/images/icon-increment-quantity.svg"/>
            </span>
            <span class="count">1</span>
            <span class="decrement">
              <img src="../assets/images/icon-decrement-quantity.svg"/>
            </span>
          </div>
        </button>
      </div>
      <div class="text">
        <p class="category">${item.category}</p>
        <h3 class="name">${item.name}</h3>
        <p class="price">$${item.price.toFixed(2)}</p>
      </div>
    `;
    let addBtn = product.querySelector(".btn");
    let btnText = product.querySelector(".btn-text");
    let counterDiv = product.querySelector(".counter");
    let productImage = product.querySelector(".product-image");
    let increment = product.querySelector(".increment");
    let decrement = product.querySelector(".decrement");
    let count = product.querySelector(".count");

    let counter = 0; // Initial count

    // Click Event for Add to Cart
    addBtn.addEventListener("click", () => {
      if (!cartItems[item.name]) {
        cartItems[item.name] = { name: item.name, price: item.price, count: 1 };
        counter = 1;
      } else {
        counter++;
        cartItems[item.name].count = counter;
      }

      count.textContent = counter;
      counterDiv.style.display = "flex";
      btnText.style.display = "none";
      addBtn.classList.add("active");
      productImage.classList.add("highlight-border");

      updateCart();
    });

    // Increment Quantity (Stop event propagation)
    increment.addEventListener("click", (event) => {
      event.stopPropagation();
      counter++;
      count.textContent = counter;
      cartItems[item.name].count = counter;
      updateCart();
    });

    // Decrement Quantity (Stop event propagation)
    decrement.addEventListener("click", (event) => {
      event.stopPropagation();
      if (counter > 1) {
        counter--;
        count.textContent = counter;
        cartItems[item.name].count = counter;
      } else {
        // Remove item from cart
        delete cartItems[item.name];
        counter = 0;

        // Reset UI
        counterDiv.style.display = "none";
        btnText.style.display = "inline-block";
        addBtn.classList.remove("active");
        productImage.classList.remove("highlight-border");
      }
      updateCart();
    });

    products.append(product);
  });
}

getData("../data.json");