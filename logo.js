const logo = document.getElementById("logo");
function adjustTitle() {
    logo.textContent = window.innerWidth <= 600 ? "🍽️ RAF" : "🍽️ Recipe App Finder";
}
adjustTitle();
window.addEventListener("resize", adjustTitle);