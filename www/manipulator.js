const chartOffcanvas = document.getElementById("chart-offcanvas");
const listItems = document.querySelectorAll(".item");
listItems.forEach((item) => {
  item.addEventListener("click", () => {
    chartOffcanvas.classList.add("active");
    console.log("Clicked");
  });
});
