// ========================================
// script.js – Interaktive Funktionen für Sichtbarkeit & UI-Verhalten
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // 💡 Menü-Effekt: Mausbewegung aktiviert das Menü (nur einmal)
  // ========================================
  const menu = document.getElementById("main-menu");
  let menuTimeout;
  let menuShown = false;

  if (menu) {
    document.addEventListener("mousemove", () => {
      if (!menuShown) {
        menu.classList.remove("hidden");
        menu.classList.add("visible");
        menuShown = true;

        // Nach 20 Sekunden wieder ausblenden (optional)
        menuTimeout = setTimeout(() => {
          menu.classList.remove("visible");
          menu.classList.add("hidden");
          menuShown = false;
        }, 20000);
      }
    });
  }

  // ========================================
  // 👁 Passwort-Sichtbarkeit umschalten
  // ========================================
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Symbol & Aria-Label wechseln
      btn.textContent = isPassword ? "🙈" : "👁";
      btn.setAttribute(
        "aria-label",
        isPassword ? "Passwort ausblenden" : "Passwort anzeigen"
      );
    });
  });
});
