// ========================================
// script.js – Interaktive Funktionen für Sichtbarkeit & UI-Verhalten
// ========================================

// 💡 Menü-Effekt: Menü wird bei erster Mausbewegung sichtbar (optional)
document.addEventListener("mousemove", () => {
  const menu = document.getElementById("main-menu");
  if (menu && !menu.classList.contains("visible")) {
    menu.classList.add("visible");
  }
});

/* 
💡 Erweiterungsideen für Menü:
- Automatisches Ausblenden nach Zeit ohne Bewegung
- Einblenden nur auf bestimmten Seiten
- Fading-Effekte per CSS hinzufügen
*/

// ========================================
// 👁 Passwort-Sichtbarkeit umschalten
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-password");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);

      if (input) {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";

        // Symbol & Aria-Label anpassen
        btn.textContent = isPassword ? "🙈" : "👁";
        btn.setAttribute(
          "aria-label",
          isPassword ? "Passwort ausblenden" : "Passwort anzeigen"
        );
      }
    });
  });
});
