// ========================================
// accessGuard.js – Zugriffsschutz für Werkbyte
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("activeUser"));
    const page = window.location.pathname;
  
    // 🧾 Erlaubte Seiten pro Rolle
    const allowFor = {
      guest: ["/", "/index.html", "/login.html", "/register.html"],
      user: ["/dashboard.html"],
      admin: ["/dashboard.html"],
      superadmin: ["/dashboard.html", "/admin.html"]
    };
  
    // 👤 Rolle bestimmen
    let role = "guest";
    if (user?.role) role = user.role;
  
    // ❌ Wenn Seite für Rolle nicht erlaubt → Redirect zur error.html
    if (!allowFor[role].includes(page)) {
      localStorage.setItem("redirectAfterError", page);
      window.location.href = "error.html";
    }
  });
  