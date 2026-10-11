import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGfNN8L3Nepdn8D9ocz9ylVB_6mKbIVcI",
    authDomain: "yokaira-46d8f.firebaseapp.com",
    projectId: "yokaira-46d8f",
    storageBucket: "yokaira-46d8f.firebasestorage.app",
    messagingSenderId: "1074371889355",
    appId: "1:1074371889355:web:e358704dd8d7b1a2ceb34e"
};

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

const currentPage = window.location.pathname.split("/").pop();
const publicPages = [
    "",
    "index.html",
    "login.html",
    "register.html"
];

const joinBox = document.getElementById("join-box");

document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
    if (joinBox) {
        joinBox.style.display = user ? "none" : "";
    }

    if (!user && !publicPages.includes(currentPage)) {
        window.location.replace("./login.html");
        return;
    }

    document.documentElement.style.visibility = "visible";
});
