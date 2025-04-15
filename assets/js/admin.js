// ========================================
// admin.js – Admin-Dashboard für Werkbyte
// Version: 16.04.2025
// Funktionen: Benutzer anzeigen, filtern, Rolle ändern, löschen, Testuser verwalten, exportieren/importieren
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const userListContainer = document.getElementById("user-list");
    const filterInput = document.getElementById("filter-input");
    const roleFilter = document.getElementById("role-filter");
    const logoutBtn = document.getElementById("logout-link");
    const createTestUserBtn = document.getElementById("create-testuser-btn");
    const deleteTestUsersBtn = document.getElementById("delete-testusers-btn");
    const exportBtn = document.getElementById("export-users-btn");
    const importInput = document.getElementById("import-users-input");
  
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    let users = JSON.parse(localStorage.getItem("users") || "[]");
  
    // Zugriff verweigern, wenn kein Superadmin
    if (!activeUser || activeUser.role !== "superadmin") {
      document.body.innerHTML = `<div class="error-message" style="padding:20px; font-size:18px; text-align:center;">
        🚫 Zugriff verweigert – nur für Superadmins erlaubt.
      </div>`;
      return;
    }
  
    // Events
    filterInput?.addEventListener("input", renderUserList);
    roleFilter?.addEventListener("change", renderUserList);
    createTestUserBtn?.addEventListener("click", createNextTestUser);
    deleteTestUsersBtn?.addEventListener("click", deleteAllTestUsers);
    exportBtn?.addEventListener("click", exportUsers);
    importInput?.addEventListener("change", importUsers);
  
    renderUserList();
  
    // ============================
    // Benutzerliste rendern
    // ============================
    function renderUserList() {
      const search = filterInput?.value?.toLowerCase() || "";
      const selectedRole = roleFilter?.value || "";
  
      const filteredUsers = users.filter((u) => {
        const matchesText =
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.phone.toLowerCase().includes(search);
        const matchesRole = !selectedRole || u.role === selectedRole;
        return matchesText && matchesRole;
      });
  
      userListContainer.innerHTML = "";
  
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr style="background:#2c2c2c;">
            <th>Benutzername</th>
            <th>E-Mail</th>
            <th>Telefon</th>
            <th>Rolle</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          ${filteredUsers.map((user, index) => `
            <tr style="border-bottom:1px solid #444;">
              <td>
                ${user.username}
                ${user.testuser ? `<span style="font-size:11px; color:#ffa726;">🧪 Testuser</span>` : ""}
              </td>
              <td>${user.email}</td>
              <td>${user.phone}</td>
              <td>
                <select class="role-select" data-index="${index}" ${user.username === activeUser.username ? 'disabled title="Du kannst deine eigene Rolle nicht ändern"' : ''}>
                  <option value="user" ${user.role === "user" ? "selected" : ""}>user</option>
                  <option value="admin" ${user.role === "admin" ? "selected" : ""}>admin</option>
                  <option value="superadmin" ${user.role === "superadmin" ? "selected" : ""}>superadmin</option>
                </select>
              </td>
              <td>
                ${user.username !== activeUser.username ? `
                  <button class="delete-btn" data-index="${index}" title="Benutzer löschen">🗑</button>
                  ${user.testuser && user.locked ? `<button class="unlock-btn" data-index="${index}" title="Testuser entsperren">🔓</button>` : ""}
                  ${user.testuser && !user.locked ? `<button class="simulate-login-btn" data-index="${index}" title="Als Testuser simulieren">🧪</button>` : ""}
                ` : `<span style="opacity:0.5;">(eigener Account)</span>`}
              </td>
            </tr>
          `).join("")}
        </tbody>
      `;
  
      userListContainer.appendChild(table);
  
      // Rollenänderung
      document.querySelectorAll(".role-select").forEach((select) => {
        select.addEventListener("change", (e) => {
          const index = e.target.dataset.index;
          const selectedUser = users[index];
          const newRole = e.target.value;
  
          if (confirm(`⚠️ Rolle von ${selectedUser.username} ändern zu "${newRole}"?`)) {
            users[index].role = newRole;
            localStorage.setItem("users", JSON.stringify(users));
  
            if (selectedUser.username === activeUser.username) {
              localStorage.setItem("activeUser", JSON.stringify(users[index]));
            }
  
            alert("✅ Rolle geändert");
            renderUserList();
          } else {
            renderUserList();
          }
        });
      });
  
      // Löschen
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const user = users[index];
  
          if (confirm(`❌ Benutzer "${user.username}" wirklich löschen?`)) {
            users.splice(index, 1);
            localStorage.setItem("users", JSON.stringify(users));
            alert("🗑 Benutzer gelöscht");
            renderUserList();
          }
        });
      });
  
      // Entsperren
      document.querySelectorAll(".unlock-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          if (users[index].locked) {
            users[index].locked = false;
            localStorage.setItem("users", JSON.stringify(users));
            alert("🔓 Testuser entsperrt.");
            renderUserList();
          }
        });
      });
  
      // Simulation
      document.querySelectorAll(".simulate-login-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.dataset.index;
          const testUser = users[index];
  
          const w = window.open("dashboard.html", "_blank");
          if (w) {
            w.localStorage.setItem("activeUser", JSON.stringify(testUser));
          } else {
            alert("⚠️ Neues Fenster konnte nicht geöffnet werden (Popup-Blocker?).");
          }
        });
      });
    }
  
    // ➕ Testuser erstellen
    function createNextTestUser() {
      let base = "User";
      let i = 1;
      const existingNames = users.map(u => u.username.toLowerCase());
  
      while (existingNames.includes((base + String(i).padStart(3, "0")).toLowerCase()) && i < 1000) {
        i++;
      }
  
      if (i >= 1000) {
        alert("⚠️ Alle Testuser-Namen (User001 - User999) sind belegt!");
        return;
      }
  
      const number = String(i).padStart(3, "0");
      const newUser = {
        username: `User${number}`,
        email: `User${number}@domain.de`,
        phone: `+49 0000 00${number}`,
        password: `Test${number}!`,
        role: "user",
        testuser: true,
        locked: true
      };
  
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert(`✅ Testuser "${newUser.username}" angelegt.`);
      renderUserList();
    }
  
    // 🧹 Testuser löschen
    function deleteAllTestUsers() {
      if (!confirm("❌ Alle Testuser (User001–User999) wirklich löschen?")) return;
  
      users = users.filter(u => !u.testuser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("🧽 Alle Testuser gelöscht.");
      renderUserList();
    }
  
    // 📤 Benutzer exportieren
    function exportUsers() {
      const json = JSON.stringify(users, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `werkbyte_users_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  
    // 📥 Benutzer importieren
    function importUsers(e) {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (!Array.isArray(imported)) throw new Error("Kein gültiges JSON-Array.");
          users = imported;
          localStorage.setItem("users", JSON.stringify(users));
          alert("📥 Benutzer importiert.");
          renderUserList();
        } catch (err) {
          alert("❌ Fehler beim Importieren: " + err.message);
        }
      };
      reader.readAsText(file);
    }
  
    // 🚪 Logout
    logoutBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("activeUser");
      window.location.href = "index.html";
    });
  });
  