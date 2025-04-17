// ========================================
// validateRegister.js – Formularvalidierung & Firebase-Registrierung
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Simple Prüfungen mit Ausgaben
    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("❗ Bitte fülle alle Felder korrekt aus.");
      return;
    }

    if (password !== confirmPassword) {
      alert("❗ Passwörter stimmen nicht überein.");
      return;
    }

    if (!validatePassword(password)) {
      alert("❗ Passwort erfüllt nicht die Anforderungen.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      console.log("✅ Benutzer erstellt:", user.uid);

      // Daten in Firestore speichern
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        phone,
        role: "user",
        createdAt: new Date().toISOString(),
        locked: false
      });

      alert("✅ Registrierung erfolgreich!");
      window.location.href = "login.html";
    } catch (err) {
      console.error("❌ Fehler bei Registrierung:", err);
      alert("❌ Registrierung fehlgeschlagen: " + err.message);
    }
  });
});

function validatePassword(pw) {
  const minLen = /.{8,}/;
  const lower = /[a-z]/;
  const upper = /[A-Z]/;
  const digit = /[0-9]/;
  const special = /[^A-Za-z0-9]/;
  return minLen.test(pw) && lower.test(pw) && upper.test(pw) && digit.test(pw) && special.test(pw);
}
