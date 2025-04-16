// ========================================
// accessGuard.js – Zugriffsschutz für geschützte Seiten
// ========================================

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

// 🔍 Aktuelle Seite ermitteln
const currentPage = window.location.pathname.split("/").pop();

// 🧠 Zugriff prüfen
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // 🔒 Nicht eingeloggt → zurück zur Loginseite
    window.location.href = "login.html";
    return;
  }

  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Benutzerprofil nicht gefunden");
    }

    const role = docSnap.data().role || "user";

    // 🔐 Nur Superadmins dürfen auf admin.html
    if (currentPage === "admin.html" && role !== "superadmin") {
      alert("⛔ Kein Zugriff – nur für Superadmins!");
      window.location.href = "dashboard.html";
    }

    // ✨ Optional: Rolle im Dashboard anzeigen
    if (currentPage === "dashboard.html") {
      const username = docSnap.data().username || "Unbekannt";
      document.getElementById("info-username").textContent = username;
      document.getElementById("info-email").textContent = user.email;
      document.getElementById("info-phone").textContent = docSnap.data().phone || "-";
      document.getElementById("info-role").textContent = role;

      // 🔓 Adminbereich anzeigen wenn Superadmin
      if (role === "superadmin") {
        document.getElementById("admin-link")?.removeAttribute("hidden");
      }
    }
  } catch (err) {
    console.error("Zugriffsfehler:", err);
    alert("❌ Zugriff verweigert oder Fehler beim Laden des Profils.");
    window.location.href = "login.html";
  }
});
