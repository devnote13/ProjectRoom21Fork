const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");


menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sideMenu.classList.toggle("show");
});

// Close when clicking outside
document.addEventListener("click", function () {
    sideMenu.classList.remove("show");
});

// Don't close when clicking inside the menu
sideMenu.addEventListener("click", function (e) {
    e.stopPropagation();
});

// Close with Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        sideMenu.classList.remove("show");
    }
});

document.querySelector(".GobackBtn").addEventListener("click", () => {
    sideMenu.classList.remove("show");
});
