    const toggleBtn = document.getElementById("toggle-dark-mode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedMode = localStorage.getItem("theme");

    if (savedMode === "dark" || (savedMode === null && prefersDark)) {
        document.body.classList.add("dark-mode");
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleBtn.textContent = isDark ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });