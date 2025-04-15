// ========================================
// validateRegister.js – Registrierung mit Validierung & Admin-Freigabe
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const registerBtn = form.querySelector("button[type='submit']");
    const pwRules = document.getElementById("password-hint");
    const capsWarningGlobal = document.getElementById("global-caps-lock-warning");
  
    const errorUsername = document.getElementById("username-error");
    const errorEmail = document.getElementById("email-error");
    const errorPhone = document.getElementById("phone-error");
    const errorPassword = document.getElementById("password-error");
    const errorConfirm = document.getElementById("confirmPassword-error");
  
    const allowedCountries = ["+49", "+43", "+41", "+1"];
    const touchedFields = new Set();
  
    // 💾 Benutzerdaten laden
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const tempUsers = JSON.parse(localStorage.getItem("tempUsers") || "[]");
  
    const usedUsernames = [...storedUsers, ...tempUsers].map(u => u.username.toLowerCase());
    const usedEmails = [...storedUsers, ...tempUsers].map(u => u.email.toLowerCase());
    const usedPhones = [...storedUsers, ...tempUsers].map(u => u.phone.replace(/\s/g, ""));
  
    // 📲 Eingabefeld-Validierung aktivieren
    [username, email, phone, password, confirmPassword].forEach(field => {
      field.addEventListener("input", () => {
        touchedFields.add(field.id);
        validateAll();
        toggleRegisterButton();
      });
  
      field.addEventListener("blur", () => {
        touchedFields.add(field.id);
        validateAll();
        toggleRegisterButton();
      });
    });
  
    // 🧽 Telefonnummer bereinigen
    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/[^+0-9 ]/g, "");
    });
  
    phone.addEventListener("blur", formatPhoneNumber);
  
    // 🔐 Passwortregeln anzeigen
    password.addEventListener("focus", () => pwRules?.classList.remove("hidden"));
  
    // 🔠 CapsLock-Warnung
    document.addEventListener("keydown", updateCapsWarning);
    document.addEventListener("keyup", updateCapsWarning);
    function updateCapsWarning(e) {
      const isCaps = e.getModifierState("CapsLock");
      capsWarningGlobal.textContent = isCaps ? "⚠️ Feststelltaste ist aktiviert!" : "";
      capsWarningGlobal.classList.toggle("hidden", !isCaps);
    }
  
    // 🔎 Hauptvalidierung
    function validateAll() {
      validateField(username, validateUsername, errorUsername);
      validateField(email, validateEmail, errorEmail);
      validateField(phone, validatePhone, errorPhone);
      validateField(password, validatePassword, errorPassword);
      validateField(confirmPassword, validateConfirmPassword, errorConfirm);
      checkDuplicates();
    }
  
    function validateField(field, validatorFn, errorEl) {
      field.classList.remove("valid", "invalid");
  
      if (!touchedFields.has(field.id)) {
        setError(errorEl, "");
        field.setCustomValidity("");
        return;
      }
  
      if (field.value.trim() === "") {
        field.setCustomValidity("Dieses Feld muss ausgefüllt werden");
        setError(errorEl, field.validationMessage);
        field.classList.add("invalid");
      } else {
        const valid = validatorFn(errorEl);
        field.classList.add(valid ? "valid" : "invalid");
      }
    }
  
    function setError(el, msg) {
      el.innerHTML = msg;
    }
  
    // 🧠 Einzelprüfungen
    function validateUsername(errorEl) {
      const val = username.value.trim();
      const regex = /^[A-Za-zÄÖÜäöüß._\-]{2,}$/;
      if (!regex.test(val) || /\s/.test(val) || /\d/.test(val)) {
        username.setCustomValidity("Nur Buchstaben und ._- erlaubt, keine Leerzeichen oder Zahlen.");
        setError(errorEl, username.validationMessage);
        return false;
      }
      username.setCustomValidity("");
      setError(errorEl, "");
      return true;
    }
  
    function validateEmail(errorEl) {
      const val = email.value.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!regex.test(val)) {
        email.setCustomValidity("Ungültige E-Mail-Adresse");
        setError(errorEl, "❌ Ungültig – Beispiel: name@domain.de");
        return false;
      }
      email.setCustomValidity("");
      setError(errorEl, "");
      return true;
    }
  
    function validatePhone(errorEl) {
      const val = phone.value.trim();
      const digits = val.replace(/\D/g, "");
      const prefix = val.match(/^(\+\d{1,3})/)?.[0] || "";
  
      if (!allowedCountries.includes(prefix)) {
        phone.setCustomValidity("Ländervorwahl nicht erlaubt");
      } else if (digits.length < 11) {
        phone.setCustomValidity("Telefonnummer ist zu kurz oder ungültig");
      } else {
        phone.setCustomValidity("");
      }
  
      setError(errorEl, phone.validationMessage);
      return phone.checkValidity();
    }
  
    function formatPhoneNumber() {
      const digits = phone.value.replace(/\D/g, "");
      if (digits.startsWith("49")) phone.value = "+49 " + digits.slice(2, 5) + " " + digits.slice(5);
      else if (digits.startsWith("43")) phone.value = "+43 " + digits.slice(2, 5) + " " + digits.slice(5);
      else if (digits.startsWith("41")) phone.value = "+41 " + digits.slice(2, 5) + " " + digits.slice(5);
      else if (digits.startsWith("1")) phone.value = "+1 " + digits.slice(1, 4) + " " + digits.slice(4);
    }
  
    function validatePassword(errorEl) {
      const val = password.value.trim();
      const rules = [];
  
      if (val.length < 8) rules.push("Mindestens 8 Zeichen");
      if (!/[a-z]/.test(val)) rules.push("1 Kleinbuchstabe");
      if (!/[A-Z]/.test(val)) rules.push("1 Großbuchstabe");
      if (!/\d/.test(val)) rules.push("1 Zahl");
      if (!/[\W_]/.test(val)) rules.push("1 Sonderzeichen");
  
      if (pwRules) {
        pwRules.innerHTML = rules.length === 0
          ? "<span style='color:#2ecc71'>✅ Alle Anforderungen erfüllt</span>"
          : `<ul>${rules.map(r => `<li>${r}</li>`).join("")}</ul>`;
      }
  
      if (rules.length > 0) {
        password.setCustomValidity("Nicht alle Anforderungen erfüllt");
        setError(errorEl, password.validationMessage);
        return false;
      }
  
      password.setCustomValidity("");
      setError(errorEl, "");
      return true;
    }
  
    function validateConfirmPassword(errorEl) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwörter stimmen nicht überein");
        setError(errorEl, confirmPassword.validationMessage);
        return false;
      }
      confirmPassword.setCustomValidity("");
      setError(errorEl, "");
      return true;
    }
  
    // 🚫 Duplikate prüfen
    function checkDuplicates() {
      const u = username.value.trim().toLowerCase();
      const e = email.value.trim().toLowerCase();
      const p = phone.value.trim().replace(/\s/g, "");
  
      if (usedUsernames.includes(u)) {
        username.setCustomValidity("Benutzername bereits vergeben");
        setError(errorUsername, username.validationMessage);
        username.classList.add("invalid");
      }
      if (usedEmails.includes(e)) {
        email.setCustomValidity("E-Mail bereits registriert");
        setError(errorEmail, email.validationMessage);
        email.classList.add("invalid");
      }
      if (usedPhones.includes(p)) {
        phone.setCustomValidity("Telefonnummer bereits registriert");
        setError(errorPhone, phone.validationMessage);
        phone.classList.add("invalid");
      }
    }
  
    function toggleRegisterButton() {
      registerBtn.disabled = !form.checkValidity();
    }
  
    // 📤 Formular absenden → Speichern als temporärer Benutzer
    form.addEventListener("submit", (e) => {
      validateAll();
      toggleRegisterButton();
  
      if (!form.checkValidity()) {
        e.preventDefault();
        return;
      }
  
      const newUser = {
        username: username.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        password: password.value.trim(),
        role: "user",
        status: "pending" // 🟡 Muss erst durch Admin freigegeben werden
      };
  
      const updatedTempUsers = [...tempUsers, newUser];
      localStorage.setItem("tempUsers", JSON.stringify(updatedTempUsers));
  
      alert("✅ Registrierung abgeschlossen. Dein Account muss jetzt vom Admin freigeschaltet werden.");
      form.reset();
      window.location.href = "login.html";
      e.preventDefault();
    });
  });
  