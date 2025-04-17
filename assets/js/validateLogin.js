// ========================================
// validateLogin.js – Firebase-Login für Werkbyte mit Debugging
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorBox = document.getElementById("login-error");

function showError(msg) {
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  } else {
    alert(msg);
  }
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  console.log("🟡 Loginversuch für:", email);

  if (!email || !password) {
    showError("Bitte E-Mail und Passwort ausfüllen.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("🟢 Firebase Auth erfolgreich:", user.uid);

    // Firestore-Daten prüfen
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await signOut(auth);
      console.warn("⚠️ Kein Firestore-Dokument gefunden für UID:", user.uid);
      return showError("❌ Benutzer nicht gefunden (Firestore).");
    }

    const userData = userDoc.data();
    console.log("📄 Firestore-Daten:", userData);

    if (userData.locked) {
      await signOut(auth);
      return showError("🔒 Dieser Benutzer ist gesperrt.");
    }

    // ✅ Speichern im localStorage
    localStorage.setItem("activeUser", JSON.stringify({
      uid: user.uid,
      username: userData.username,
      email: user.email,
      phone: userData.phone || "",
      role: userData.role || "user"
    }));

    console.log("✅ Login erfolgreich, Weiterleitung zum Dashboard...");
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("❌ Login fehlgeschlagen:", err);
    showError("❌ Login fehlgeschlagen: " + (err.message || "Unbekannter Fehler"));
  }
});
