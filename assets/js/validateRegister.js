// ========================================
// validateRegister.js – Firebase Registration für Werkbyte
// ========================================

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);
const form = document.getElementById("registerForm");

// 🔁 Helper
function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErrors() {
  ["username", "email", "phone", "password", "confirmPassword"].forEach(id => setError(`${id}-error`, ""));
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;
  const hint = document.getElementById("password-hint");

  // Validierung
  let valid = true;
  const passwordRules = [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/];

  if (!username) { setError("username-error", "Benutzername erforderlich"); valid = false; }
  if (!email.includes("@")) { setError("email-error", "Ungültige E-Mail-Adresse"); valid = false; }
  if (!phone.startsWith("+")) { setError("phone-error", "Telefonnummer muss mit + beginnen"); valid = false; }
  if (password !== confirmPassword) { setError("confirmPassword-error", "Passwörter stimmen nicht überein"); valid = false; }
  if (!passwordRules.every(rule => rule.test(password))) {
    setError("password-error", "Passwort erfüllt nicht die Anforderungen");
    hint?.classList.remove("hidden");
    valid = false;
  } else {
    hint?.classList.add("hidden");
  }
  if (!valid) return;

  try {
    console.log("🔄 Registrierung wird gestartet...");

    // Duplikatprüfung (optional)
    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      setError("email-error", "E-Mail ist bereits registriert");
      return;
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    console.log("✅ Firebase Auth erfolgreich", user.uid);

    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      phone,
      role: "user",
      locked: false,
      createdAt: new Date().toISOString()
    });

    alert("✅ Registrierung erfolgreich");
    window.location.href = "login.html";
  } catch (err) {
    console.error("❌ Fehler bei Registrierung:", err);
    alert("❌ Fehler: " + (err.message || "Unbekannter Fehler"));
  }
});
