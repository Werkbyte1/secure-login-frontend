// ========================================
// admin.js – Admin-Dashboard für Werkbyte
// ========================================

<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin-Bereich – Werkbyte</title>

  <!-- 💅 Styles & Scripts -->
  <link rel="stylesheet" href="assets/css/style.css" />
  <script defer src="assets/js/script.js"></script>
  <script defer src="assets/js/admin.js"></script>

  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #121212;
      color: white;
      display: flex;
    }

    .sidebar {
      width: 250px;
      background-color: #1e1e1e;
      height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      left: 0;
    }

    .sidebar h2 {
      color: #00bcd4;
      font-size: 1.2rem;
      margin-bottom: 20px;
    }

    .sidebar a {
      display: block;
      color: white;
      text-decoration: none;
      margin: 12px 0;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .sidebar a:hover {
      background-color: #00bcd4;
      color: black;
    }

    .main {
      margin-left: 270px;
      padding: 30px;
      max-width: 900px;
      width: 100%;
    }

    h1, h2 {
      text-align: center;
    }

    .hint {
      text-align: center;
      color: #bbb;
      margin-top: -10px;
      margin-bottom: 30px;
    }

    input, select, button {
      font-size: 1rem;
    }

    .btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      margin-right: 10px;
    }

    .btn.primary {
      background-color: #00bcd4;
      color: black;
      font-weight: bold;
    }

    .btn.danger {
      background-color: #ff5252;
      color: white;
    }

    #filter-input, #role-filter {
      padding: 8px;
      width: 100%;
      border-radius: 6px;
      border: none;
      margin-bottom: 16px;
    }

    label.btn {
      background-color: #4caf50;
      color: white;
    }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <div class="sidebar">
    <h2>🛠️ Admin-Menü</h2>
    <a href="dashboard.html">📊 Dashboard</a>
    <a href="#" id="logout-link">🚪 Logout</a>
  </div>

  <!-- Hauptbereich -->
  <div class="main">
    <h1>🛠️ Admin-Bereich</h1>
    <p class="hint">Nur für <strong>Superadmins</strong> – Änderungen wirken sich direkt aus.</p>

    <section>
      <h2>🔍 Benutzer filtern</h2>
      <input type="text" id="filter-input" placeholder="🔎 Suche nach Name, E-Mail oder Telefon..." />
      <select id="role-filter">
        <option value="">🔽 Rolle filtern (alle)</option>
        <option value="user">user</option>
        <option value="admin">admin</option>
        <option value="superadmin">superadmin</option>
      </select>
    </section>

    <section id="admin-users">
      <h2>👥 Benutzerverwaltung</h2>
      <div id="user-list">
        <!-- Wird dynamisch erzeugt -->
      </div>
    </section>

    <section style="margin-top: 40px;">
      <h2>🧪 Testuser erzeugen</h2>
      <button id="create-testuser-btn" class="btn primary">➕ Testuser hinzufügen</button>
      <button id="delete-testusers-btn" class="btn danger">🗑 Alle Testuser löschen</button>
      <p class="hint">User001–User999 dienen Testzwecken und <strong>können sich nicht einloggen</strong>.</p>
    </section>

    <section style="margin-top: 40px;">
      <h2>📁 Verwaltungstools</h2>
      <button id="export-users-btn" class="btn">📤 Benutzer exportieren (JSON)</button>
      <input type="file" id="import-users-input" accept=".json" style="display: none;" />
      <label for="import-users-input" class="btn">📥 Benutzer importieren (JSON)</label>
    </section>
  </div>

</body>
</html>
