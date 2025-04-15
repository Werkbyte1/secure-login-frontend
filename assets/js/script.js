// ========================================
// script.js – Interaktive Funktionen für Sichtbarkeit & UI-Verhalten
// ========================================

// 💡 Menü-Effekt: Einmalige Mausbewegung aktiviert das Hauptmenü
document.addEventListener("mousemove", () => {
  const menu = document.getElementById("main-menu");
  if (menu && !menu.classList.contains("visible")) {
    menu.classList.add("visible");
    menu.classList.remove("hidden");

    // Optional: Menü nach 20 Sek. Inaktivität wieder ausblenden
    setTimeout(() => {
      menu.classList.add("hidden");
      menu.classList.remove("visible");
    }, 20000); // 20 Sekunden
  }
});

// ========================================
// 👁 Passwort-Sichtbarkeit umschalten
// ========================================
document.addEventListener("DOMContentLoaded", () => {
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
