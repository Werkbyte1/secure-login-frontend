// ========================================
// validateLogin.js – Login mit Validierung & Aktivierung temporärer Accounts
// Blockiert Testnutzer außerhalb des Adminbereichs
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const identifier = document.getElementById("login-identifier");
    const password = document.getElementById("login-password");
    const errorIdentifier = document.getElementById("login-identifier-error");
    const errorPassword = document.getElementById("login-password-error");
    const capsHint = document.getElementById("global-caps-lock-warning");
    const loginBtn = form.querySelector("button[type='submit']");
    const touchedFields = new Set();
  
    // 💾 Lokale Daten laden
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const tempUsers = JSON.parse(localStorage.getItem("tempUsers") || "[]");
  
    // ❌ Vorheriger aktiver Benutzer löschen
    localStorage.removeItem("activeUser");
  
    // 🧢 CapsLock-Erkennung
    document.addEventListener("keydown", updateCapsWarning);
    document.addEventListener("keyup", updateCapsWarning);
  
    function updateCapsWarning(e) {
      const isCaps = e.getModifierState("CapsLock");
      capsHint.textContent = isCaps ? "⚠️ Feststelltaste ist aktiviert!" : "";
      capsHint.classList.toggle("hidden", !isCaps);
    }
  
    // 🧪 Live-Validierung
    [identifier, password].forEach((field) => {
      field.addEventListener("input", () => {
        touchedFields.add(field.id);
        validateAll();
      });
  
      field.addEventListener("blur", () => {
        touchedFields.add(field.id);
        validateAll();
      });
    });
  
    function validateAll() {
      validateField(identifier, validateIdentifier, errorIdentifier);
      validateField(password, validatePassword, errorPassword);
      toggleButton();
    }
  
    function validateField(field, validateFn, errorEl) {
      field.classList.remove("valid", "invalid");
  
      if (!touchedFields.has(field.id)) {
        errorEl.textContent = "";
        field.setCustomValidity("");
        return;
      }
  
      if (field.value.trim() === "") {
        field.setCustomValidity("Dieses Feld darf nicht leer sein");
        errorEl.textContent = field.validationMessage;
        field.classList.add("invalid");
      } else {
        const valid = validateFn(errorEl);
        field.classList.add(valid ? "valid" : "invalid");
      }
    }
  
    function validateIdentifier(errorEl) {
      const val = identifier.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const usernameRegex = /^[A-Za-zÄÖÜäöüß._\-]{2,}$/;
  
      if (emailRegex.test(val) || usernameRegex.test(val)) {
        identifier.setCustomValidity("");
        errorEl.textContent = "";
        return true;
      } else {
        identifier.setCustomValidity("Gib bitte einen gültigen Benutzernamen oder eine E-Mail-Adresse ein");
        errorEl.textContent = identifier.validationMessage;
        return false;
      }
    }
  
    function validatePassword(errorEl) {
      const val = password.value.trim();
      if (val.length < 8) {
        password.setCustomValidity("Passwort muss mindestens 8 Zeichen lang sein");
        errorEl.textContent = password.validationMessage;
        return false;
      } else {
        password.setCustomValidity("");
        errorEl.textContent = "";
        return true;
      }
    }
  
    function toggleButton() {
      loginBtn.disabled = !form.checkValidity();
    }
  
    // 🚀 Login starten
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      validateAll();
  
      if (!form.checkValidity()) return;
  
      const input = identifier.value.trim().toLowerCase();
      const pw = password.value.trim();
      let foundUser = null;
  
      // ✅ Aktive Benutzer durchsuchen
      foundUser = storedUsers.find((u) =>
        (u.username.toLowerCase() === input || u.email.toLowerCase() === input) &&
        u.password === pw
      );
  
      // 🛑 Blockiert? (locked: true → z. B. Testuser)
      if (foundUser?.locked) {
        alert("⛔ Dieser Benutzer ist gesperrt und kann nicht über die Login-Seite genutzt werden.");
        return;
      }
  
      // ❌ Noch kein aktiver Nutzer gefunden → temporäre prüfen
      if (!foundUser) {
        const tempIndex = tempUsers.findIndex((u) =>
          (u.username.toLowerCase() === input || u.email.toLowerCase() === input) &&
          u.password === pw
        );
  
        if (tempIndex !== -1) {
          foundUser = tempUsers[tempIndex];
  
          // ✅ Aktivieren (nach Admin-Freigabe)
          storedUsers.push(foundUser);
          tempUsers.splice(tempIndex, 1);
          localStorage.setItem("users", JSON.stringify(storedUsers));
          localStorage.setItem("tempUsers", JSON.stringify(tempUsers));
  
          alert("✅ Dein Account wurde aktiviert und du bist nun eingeloggt!");
        }
      }
  
      if (foundUser) {
        // 🎉 Login erfolgreich
        localStorage.setItem("activeUser", JSON.stringify(foundUser));
        alert(`✅ Willkommen zurück, ${foundUser.username}!`);
        window.location.href = "dashboard.html";
      } else {
        // ❌ Fehleranzeige
        errorIdentifier.textContent = "Benutzer nicht gefunden oder Passwort falsch";
        errorPassword.textContent = "";
        identifier.classList.add("invalid");
        password.classList.add("invalid");
      }
    });
  });
  