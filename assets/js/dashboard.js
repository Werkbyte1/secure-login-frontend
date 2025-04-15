// ========================================
// dashboard.js – Dashboard-Daten anzeigen + Logout
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    // 🔐 Aktiven Benutzer aus dem localStorage holen
    const user = JSON.parse(localStorage.getItem("activeUser"));
  
    // ❌ Kein Benutzer eingeloggt? → Zurück zur Login-Seite
    if (!user || !user.username || !user.role) {
      alert("⚠️ Kein Benutzer eingeloggt. Bitte melde dich an.");
      window.location.href = "login.html";
      return;
    }
  
    // ✅ Benutzerinformationen ins Dashboard schreiben
    document.getElementById("info-username").textContent = user.username || "–";
    document.getElementById("info-email").textContent = user.email || "–";
    document.getElementById("info-phone").textContent = user.phone || "–";
    document.getElementById("info-role").textContent = user.role || "user";
  
    // 🛡️ Admin-Link anzeigen, wenn Rolle = superadmin
    if (user.role === "superadmin") {
      const existingAdminLink = document.getElementById("admin-link");
  
      if (existingAdminLink) {
        existingAdminLink.hidden = false; // Link existiert im HTML → nur einblenden
      } else {
        // Falls der Link dynamisch eingefügt werden soll:
        const navList = document.querySelector("#dashboard-nav ul");
        const adminItem = document.createElement("li");
        adminItem.innerHTML = `<a href="admin.html" id="admin-link">🛠️ Adminbereich</a>`;
        navList.insertBefore(adminItem, navList.lastElementChild); // vor "Logout"
      }
    }
  
    // 🚪 Logout-Funktion
    const logoutBtn = document.getElementById("logout-link");
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("activeUser");   // Benutzer ausloggen
      window.location.href = "index.html";     // Zurück zur Startseite
    });
  });
  