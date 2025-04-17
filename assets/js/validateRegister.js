// ========================================
// validateRegister.js – Registrierung mit Firebase & Validierung
// Version: 17.04.2025
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Deine Firebase-Konfiguration (wird normalerweise aus firebase-config.js geladen)
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("registerForm");

// ========================================
// Globale Funktionen
// ========================================
const showError = (id, message) => {
  const el = document.getElementById(id);
  el.textContent = message;
  el.style.display = message ? "block" : "none";
};

const clearErrors = () => {
  ["username", "email", "phone", "password", "confirmPassword"].forEach((field) =>
    showError(`${field}-error`, "")
  );
};

const validatePassword = (pass) => {
  return /[a-z]/.test(pass) &&
    /[A-Z]/.test(pass) &&
    /[0-9]/.test(pass) &&
    /[^\w\s]/.test(pass) &&
    pass.length >= 8;
};

// ========================================
// Registrierung auslösen
// ========================================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  let valid = true;

  if (!username) {
    showError("username-error", "Bitte gib einen Benutzernamen ein.");
    valid = false;
  }

  if (!email || !email.includes("@")) {
    showError("email-error", "Bitte gib eine gültige E-Mail-Adresse ein.");
    valid = false;
  }

  if (!phone || !/^\+?[0-9\s]+$/.test(phone)) {
    showError("phone-error", "Bitte gib eine gültige Telefonnummer ein.");
    valid = false;
  }

  if (!validatePassword(password)) {
    showError("password-error", "Das Passwort erfüllt nicht die Anforderungen.");
    document.getElementById("password-hint")?.classList.remove("hidden");
    valid = false;
  }

  if (password !== confirmPassword) {
    showError("confirmPassword-error", "Die Passwörter stimmen nicht überein.");
    valid = false;
  }

  if (!valid) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      phone,
      role: "user",
      createdAt: new Date().toISOString()
    });

    alert("✅ Registrierung erfolgreich!");
    window.location.href = "login.html";
  } catch (error) {
    const errorMessage = error.message || "Ein Fehler ist aufgetreten.";
    alert("❌ Fehler: " + errorMessage);
  }
});
