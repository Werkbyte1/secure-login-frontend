
import { auth } from './firebase-init.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
});
