const toggleBtn = document.getElementById("toggle-dark-mode");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedMode = localStorage.getItem("theme");
const logoProyecto = document.getElementById("logo-proyecto");

function updateLogo() {
    if (!logoProyecto) return;
    if (document.body.classList.contains("dark-mode")) {
        logoProyecto.src = "./imgs/LogoDarkMode.png"; // Usa tu logo para modo oscuro
    } else {
        logoProyecto.src = "./imgs/LogoLightmode.png";
    }
}

if (savedMode === "dark" || (savedMode === null && prefersDark)) {
    document.body.classList.add("dark-mode");
    updateLogo();
} else {
    updateLogo();
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️ Modo claro" : "🌙 Modo oscuro";
    updateLogo();
});