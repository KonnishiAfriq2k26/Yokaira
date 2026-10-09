// ========================================
// YOKAIRA — AUTHENTIFICATION FIREBASE
// ========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAGfNN8L3Nepdn8D9ocz9ylVB_6mKbIVcI",
    authDomain: "yokaira-46d8f.firebaseapp.com",
    projectId: "yokaira-46d8f",
    storageBucket: "yokaira-46d8f.firebasestorage.app",
    messagingSenderId: "1074371889355",
    appId: "1:1074371889355:web:e358704dd8d7b1a2ceb34e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycby0cUVSselFg2QMtQH4Crob_6WBt_8ojijZQgVHprMED3_Hh5iNLm-EuesuuinAi2mzmg/exec";

const registerForm = document.getElementById("registerForm");
const statusMessage = document.getElementById("registerMessageStatus");

if (registerForm && statusMessage) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document
            .getElementById("registerUsername").value.trim();

        const email = document
            .getElementById("registerEmail").value.trim();

        const passion = document
            .getElementById("registerPassion").value;

        const password = document
            .getElementById("registerPassword").value;

        const passwordConfirm = document
            .getElementById("registerPasswordConfirm").value;

        const message = document
            .getElementById("registerMessage").value.trim();

        const button = document.getElementById("registerButton");

        if (!username || !email || !passion || !password) {
            statusMessage.textContent =
                "Remplis tous les champs obligatoires.";
            return;
        }

        if (password.length < 8) {
            statusMessage.textContent =
                "Le mot de passe doit contenir au moins 8 caractères.";
            return;
        }

        if (password !== passwordConfirm) {
            statusMessage.textContent =
                "Les deux mots de passe ne correspondent pas.";
            return;
        }

        button.disabled = true;
        button.textContent = "Création du compte...";
        statusMessage.textContent = "Création de ton compte YOKAIRA...";

        try {
            // 1. Création du compte Firebase
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // 2. Enregistrement du pseudo
            await updateProfile(credential.user, {
                displayName: username
            });

            // 3. Sauvegarde locale des informations non sensibles
            localStorage.setItem("yokairaUser", JSON.stringify({
                username,
                email,
                passion
            }));

            statusMessage.textContent =
                "🎉 Bienvenue dans YOKAIRA ! Ton compte est créé. Ouverture de ton profil...";

            // 4. Envoi indépendant vers Google Sheets
            // Cet envoi ne doit pas bloquer la redirection.
            fetch(SHEETS_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    name: username,
                    email,
                    passion,
                    message
                })
            }).catch((error) => {
                console.error("Erreur Google Sheets :", error);
            });

            // 5. Redirection automatique
            window.location.replace("profil.html");

        } catch (error) {
            console.error("Erreur Firebase :", error);

            const errors = {
                "auth/email-already-in-use":
                    "Cette adresse e-mail possède déjà un compte.",
                "auth/invalid-email":
                    "L'adresse e-mail est invalide.",
                "auth/weak-password":
                    "Choisis un mot de passe plus robuste.",
                "auth/operation-not-allowed":
                    "L'inscription par e-mail n'est pas activée dans Firebase.",
                "auth/network-request-failed":
                    "Problème de connexion Internet. Réessaie.",
                "auth/unauthorized-domain":
                    "Le domaine de ce site doit être autorisé dans Firebase Authentication."
            };

            statusMessage.textContent =
                errors[error.code] ||
                "La création du compte a échoué. Réessaie.";
        } finally {
            button.disabled = false;
            button.textContent = "Créer mon compte";
        }
    });
}