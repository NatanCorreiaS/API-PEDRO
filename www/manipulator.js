const chartOffcanvas = document.getElementById("chart-offcanvas");
const listItems = document.querySelectorAll(".item");

// offcanvas chart items
const chartItem = document.createElement("div");


listItems.forEach((item) => {
  item.addEventListener("click", () => {
    chartOffcanvas.classList.add("active");
    console.log("Clicked");
  });
});
