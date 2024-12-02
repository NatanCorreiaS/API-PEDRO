const chartOffcanvas = document.getElementById("chart-offcanvas");
const listItems = document.querySelectorAll(".item");
const totalPriceNumber = document.querySelector("#total-price-number");

const API = "https://api-pedro-production.up.railway.app/api";

// Cria um elemento de popup de sucesso
function createSuccessPopup(message) {
  // Cria um novo div para o popup
  const popup = document.createElement("div");

  // Define o estilo do popup
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.padding = "15px 30px";
  popup.style.backgroundColor = "#4CAF50"; // Cor verde para sucesso
  popup.style.color = "white";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "1000";
  popup.style.fontSize = "16px";
  popup.style.fontFamily = "Arial, sans-serif";

  // Define o conteúdo do popup
  popup.innerText = message;

  // Adiciona o popup ao corpo do documento
  document.body.appendChild(popup);

  // Remove o popup após 3 segundos
  setTimeout(() => {
    popup.remove();
  }, 3000);
}

const fetchItems = async () => {
  try {
    const response = await fetch(`${API}`);
    console.log(response); // Verificar a resposta da API
    const data = await response.json();
    return await data.chart;
  } catch (error) {
    console.error(error);
  }
};

const fetchTotal = async () => {
  try {
    const response = await fetch(`${API}`);
    const data = await response.json();
    return await data.total;
  } catch (error) {
    console.error(error);
  }
};

const updateItemQuantity = async (productName, quantityChange) => {
  try {
    const items = await fetchItems();
    if (!items) throw new Error("Falha ao carregar os itens.");

    const itemData = items.find((item) => item.productName === productName);
    if (!itemData)
      throw new Error(`Item com nome ${productName} não encontrado.`);

    const newQuantity = itemData.quantity + quantityChange;

    const response = await fetch(`${API}/${itemData.productName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...itemData, quantity: newQuantity }),
    });

    createSuccessPopup("Quantidade do item atualizada com sucesso!");

    if (!response.ok)
      throw new Error("Falha ao atualizar a quantidade do item.");

    return newQuantity;
  } catch (error) {
    console.error("Erro:", error.message);
    throw error;
  }
};

const createItemInBackend = async (itemName, price) => {
  const items = await fetchItems();
  const itemData = items.find((item) => item.productName === itemName);
  if (itemData) {
    return itemData;
  }

  const response = await fetch(`${API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productName: itemName,
      price: price,
      quantity: 1,
    }),
  });
  createSuccessPopup("Item adicionado com sucesso!");

  return response.json();
};

const deleteItemFromBackend = async (productName) => {
  try {
    const items = await fetchItems();
    const itemData = items.find((item) => item.productName === productName);
    if (itemData) {
      await fetch(`${API}/${itemData.productName}`, {
        method: "DELETE",
      });
      console.log("Item removido");
      createSuccessPopup("Item removido com sucesso!");
      return true;
    } else {
      console.log("Item não encontrado");
      return false;
    }
  } catch (error) {
    console.log("Erro:", error.message);
    return false;
  }
};

const init = async () => {
  const items = await fetchItems();
  let total = 0;
  items.forEach((item) => {
    const itemName = item.productName;
    const itemPrice = item.price;
    const itemQuantity = item.quantity;
    total += itemPrice * itemQuantity;

    listItems.forEach((listItem) => {
      if (listItem.querySelector("h3").textContent.includes(itemName)) {
        console.log(listItem.querySelector("img").src);

        const chartItem = createChartItem({
          id: item.id,
          img: listItem.querySelector("img").src,
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
        });

        chartContainer.appendChild(chartItem);
      }
    });
  });

  totalPriceNumber.textContent = total.toFixed(2);

  if (items.length > 0) {
    chartOffcanvas.classList.add("active");
  }
};

init();

const chartContainer = document.querySelector(".chart-container");
const createChartItem = (item) => {
  const chartItem = document.createElement("div");
  chartItem.classList.add("chart-item");
  const chartImg = document.createElement("img");
  const chartItemName = document.createElement("h3");
  chartItemName.classList.add("chart-item-name");
  const chartItemPrice = document.createElement("h4");
  chartItemPrice.classList.add("chart-price");
  chartItemPrice.innerText = "R$: ";
  const priceNumber = document.createElement("span");
  priceNumber.id = "price-number";
  const addRemoveContainer = document.createElement("div");
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
  chartItem.appendChild(chartImg);
  chartItem.appendChild(chartItemName);
  chartItem.appendChild(chartItemPrice);
  chartItemPrice.appendChild(priceNumber);
  chartItem.appendChild(addRemoveContainer);
  addRemoveContainer.appendChild(minusIcon);
  addRemoveContainer.appendChild(plusIcon);
  chartItem.appendChild(chartQuantity);
  chartQuantity.appendChild(chartQuantityNumber);

  chartItem.id = item.id;
  chartImg.src = item.img;
  chartItemName.textContent = item.name;
  priceNumber.innerText = item.price;
  chartQuantityNumber.textContent = item.quantity;

  return chartItem;
};

listItems.forEach((item) => {
  item.addEventListener("click", async () => {
    chartOffcanvas.classList.add("active");
    const itemName = item.querySelector("h3").textContent;
    const itemImg = item.querySelector("img").src;
    const itemPrice = parseFloat(
      item.querySelector("h4").textContent.replace(/[^\d.-]+/g, "")
    );

    const existingChartItem = Array.from(chartContainer.children).find(
      (child) =>
        child.querySelector(".chart-item-name").textContent === itemName
    );

    if (existingChartItem) {
      const quantityNumber =
        existingChartItem.querySelector(".quantity-number");
      const newQuantity = await updateItemQuantity(itemName, 1);
      quantityNumber.textContent = newQuantity;
    } else {
      const newItem = await createItemInBackend(itemName, itemPrice);
      const chartItem = createChartItem({
        id: newItem.id,
        img: itemImg,
        name: itemName,
        price: itemPrice,
        quantity: 1,
      });
      chartContainer.appendChild(chartItem);
    }

    const totalPrice = parseFloat(totalPriceNumber.textContent);
    const newTotalPrice = totalPrice + itemPrice;
    totalPriceNumber.textContent = newTotalPrice.toFixed(2);
  });
});

chartContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("fa-plus")) {
    const chartItem = e.target.parentElement.parentElement;
    const itemName = chartItem.querySelector(".chart-item-name").textContent;
    const priceNumber = chartItem.querySelector("#price-number");
    const price = parseFloat(priceNumber.textContent);

    const newQuantity = await updateItemQuantity(itemName, 1);
    const quantityNumber = chartItem.querySelector(".quantity-number");
    quantityNumber.textContent = newQuantity;

    const totalPrice = parseFloat(totalPriceNumber.textContent);
    const newTotalPrice = totalPrice + price;
    totalPriceNumber.textContent = newTotalPrice.toFixed(2);
  }
});

chartContainer.addEventListener("click", async (e) => {
  if (e.target.classList.contains("fa-minus")) {
    const chartItem = e.target.parentElement.parentElement;
    const itemName = chartItem.querySelector(".chart-item-name").textContent;
    const priceNumber = chartItem.querySelector("#price-number");
    const price = parseFloat(priceNumber.textContent);

    const newQuantity = await updateItemQuantity(itemName, -1);
    const quantityNumber = chartItem.querySelector(".quantity-number");
    quantityNumber.textContent = newQuantity;

    const totalPrice = parseFloat(totalPriceNumber.textContent);
    const newTotalPrice = totalPrice - price;
    totalPriceNumber.textContent = newTotalPrice.toFixed(2);
    console.log("Quantidade: ", newQuantity);
    if (newQuantity <= 0) {
      await deleteItemFromBackend(itemName);
      chartItem.remove();
      console.log("Item removido");
    }
    if (chartContainer.children.length === 0) {
      chartOffcanvas.classList.remove("active");
    }
  }
});

chartOffcanvas.addEventListener("click", () => {
  if (chartContainer.children.length === 0) {
    chartOffcanvas.classList.remove("active");
  }
});
