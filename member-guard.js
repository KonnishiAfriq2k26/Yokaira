import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

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

document.documentElement.style.visibility = "hidden";

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.documentElement.style.visibility = "visible";
    } else {
        window.location.replace("./login.html");
    }
});