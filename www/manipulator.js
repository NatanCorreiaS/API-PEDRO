const chartOffcanvas = document.getElementById("chart-offcanvas");
const listItems = document.querySelectorAll(".item");
const totalPriceNumber = document.querySelector("#total-price-number");

// offcanvas chart items
const chartContainer = document.querySelector(".chart-container");
const chartItem = document.createElement("div");
chartItem.classList.add("chart-item"); // add class to chart item
// Elements of chart item
const chartImg = document.createElement("img");
const chartItemName = document.createElement("h3");
chartItemName.classList.add("chart-item-name");
const chartItemPrice = document.createElement("h4");
chartItemPrice.classList.add("chart-price");
chartItemPrice.innerText = "R$: ";
const priceNumber = document.createElement("span");
priceNumber.id = "price-number";
const addRemoveContainer = document.createElement("div");
// Container with plus and minus buttons
addRemoveContainer.classList.add("add-remove-container");
const plusIcon = document.createElement("i");
plusIcon.classList.add("fa-solid", "fa-plus");
const minusIcon = document.createElement("i");
minusIcon.classList.add("fa-solid", "fa-minus");
const chartQuantity = document.createElement("p");
chartQuantity.classList.add("chart-quantity");
chartQuantity.innerText = "Quantidade: ";
const chartQuantityNumber = document.createElement("span");
chartQuantityNumber.classList.add("quantity-number");
// Append elements to chart item
chartItem.appendChild(chartImg);
chartItem.appendChild(chartItemName);
chartItem.appendChild(chartItemPrice);
chartItemPrice.appendChild(priceNumber);
chartItem.appendChild(addRemoveContainer);
addRemoveContainer.appendChild(minusIcon);
addRemoveContainer.appendChild(plusIcon);
chartItem.appendChild(chartQuantity);
chartQuantity.appendChild(chartQuantityNumber);

// Main event when the product is clicked
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    // console.log(item.id);
    chartOffcanvas.classList.add("active");
    // Checking if the chartContainer already have a children with that id, if have will increase in one the quantity, else will add to the chartContainer
    if (chartContainer.querySelector(`#${item.id}`)) {
      const chartItem = chartContainer.querySelector(`#${item.id}`);
      const quantityNumber = chartItem.querySelector(".quantity-number");
      quantityNumber.textContent = parseInt(quantityNumber.textContent) + 1;
      // Updating the total price
      // parsing both totalprice and item price to float, sum them and then convert to string
      const totalPrice = parseFloat(totalPriceNumber.innerText);
      const priceText = item.querySelector("h4").innerText;
      const price = parseFloat(priceText.replace(/[^\d.-]+/g, ""));
      const newTotalPrice = totalPrice + price;
      totalPriceNumber.innerHTML = newTotalPrice.toFixed(2);
    } else {
      const itemImg = item.querySelector("img").src;
      const itemName = item.querySelector("h3").textContent;
      const itemPrice = item.querySelector("h4").textContent;
      // Separating the text after "R$" and parsing the number to float
      const price = parseFloat(itemPrice.replace(/[^\d.-]+/g, ""));

      chartItem.id = item.id;
      chartImg.src = itemImg;
      chartItemName.textContent = itemName;
      priceNumber.innerText = price;
      chartQuantityNumber.textContent = 1;
      chartContainer.appendChild(chartItem.cloneNode(true));
      // Updating the total price
      // Parsing both totalprice and item price to float, sum them and then convert to string
      const totalPrice = parseFloat(totalPriceNumber.textContent);
      const newTotalPrice = totalPrice + price;
      totalPriceNumber.textContent = newTotalPrice.toFixed(2);
    }
  });
});

// Event to increase quantity of item
chartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-plus")) {
    const chartItem = e.target.parentElement.parentElement;
    const quantityNumber = chartItem.querySelector(".quantity-number");
    const priceNumber = chartItem.querySelector("#price-number");
    const totalPrice = parseFloat(totalPriceNumber.textContent);
    const price = parseFloat(priceNumber.textContent);
    const newTotalPrice = totalPrice + price;
    totalPriceNumber.textContent = newTotalPrice.toFixed(2);
    quantityNumber.textContent = parseInt(quantityNumber.textContent) + 1;
  }
});

// Event to decrease the quantity of item, if the quantity is 1, will remove the item from the chart
chartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-minus")) {
    const chartItem = e.target.parentElement.parentElement;
    const quantityNumber = chartItem.querySelector(".quantity-number");
    const priceNumber = chartItem.querySelector("#price-number");
    const totalPrice = parseFloat(totalPriceNumber.textContent);
    const price = parseFloat(priceNumber.textContent);
    const newTotalPrice = totalPrice - price;
    totalPriceNumber.textContent = newTotalPrice.toFixed(2);
    quantityNumber.textContent = parseInt(quantityNumber.textContent) - 1;
    if (parseInt(quantityNumber.textContent) === 0) {
      chartItem.remove();
    }
  }
});

// Event to close the offcanvas if there's no more items in the chart
chartOffcanvas.addEventListener("click", () => {
  if (chartContainer.children.length === 0) {
    chartOffcanvas.classList.remove("active");
  }
});
