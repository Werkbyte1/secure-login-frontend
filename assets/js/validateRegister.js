// ========================================
// validateRegister.js – Registrierung mit Firebase Auth + Firestore
// ========================================

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 📥 Eingaben auslesen
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 🔁 Fehleranzeigen zurücksetzen
  document.querySelectorAll(".error-message").forEach((el) => el.textContent = "");

  // ✅ Validierung starten
  let valid = true;

  if (username.length < 3) {
    document.getElementById("username-error").textContent = "Benutzername muss mindestens 3 Zeichen haben.";
    valid = false;
  }

  if (!email.includes("@") || email.length < 5) {
    document.getElementById("email-error").textContent = "Bitte gib eine gültige E-Mail-Adresse ein.";
    valid = false;
  }

  if (!phone.startsWith("+")) {
    document.getElementById("phone-error").textContent = "Telefonnummer muss mit + beginnen.";
    valid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("confirmPassword-error").textContent = "Passwörter stimmen nicht überein.";
    valid = false;
  }

  const passwordRules = [
    /.{8,}/,
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[!@#$%^&*]/
  ];

  if (!passwordRules.every(rule => rule.test(password))) {
    document.getElementById("password-error").textContent = "Passwort erfüllt nicht alle Anforderungen.";
    document.getElementById("password-hint").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("password-hint").classList.add("hidden");
  }

  if (!valid) return;

  try {
    // 🔍 Existierende E-Mail prüfen
    const q = query(collection(db, "users"), where("email", "==", email));
    const existing = await getDocs(q);
    if (!existing.empty) {
      document.getElementById("email-error").textContent = "Diese E-Mail ist bereits registriert.";
      return;
    }

    // 🔐 Firebase Authentication erstellen
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 📁 Firestore User-Daten speichern
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      phone,
      role: "user",
      locked: false
    });

    alert("✅ Registrierung erfolgreich!");
    window.location.href = "login.html";

  } catch (err) {
    console.error("Fehler bei Registrierung:", err);
    alert("❌ Fehler bei der Registrierung: " + err.message);
  }
});
