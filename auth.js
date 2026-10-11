// ========================================
// YOKAIRA — INSCRIPTION FIREBASE
// ========================================

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

// ----------------------------------------
// CONFIGURATION FIREBASE
// ----------------------------------------

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

// ----------------------------------------
// GOOGLE SHEETS
// ----------------------------------------

const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycby0cUVSselFg2QMtQH4Crob_6WBt_8ojijZQgVHprMED3_Hh5iNLm-EuesuuinAi2mzmg/exec";

// ----------------------------------------
// INSCRIPTION
// ----------------------------------------

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username =
            document.getElementById("registerUsername")?.value.trim();

        const email =
            document.getElementById("registerEmail")?.value.trim();

        const passion =
            document.getElementById("registerPassion")?.value.trim();

        const password =
            document.getElementById("registerPassword")?.value;

        const passwordConfirm =
            document.getElementById("registerPasswordConfirm")?.value;

        const messageElement =
            document.getElementById("registerMessageStatus") ||
            document.getElementById("registerMessage");

        const registerButton =
            document.getElementById("registerButton");

        function showMessage(message, isError = true) {
            if (messageElement) {
                messageElement.textContent = message;
                messageElement.style.color = isError
                    ? "#ff8caa"
                    : "#8fffc1";
            } else {
                alert(message);
            }
        }

        if (!username || !email || !passion ||
            !password || !passwordConfirm) {
            showMessage("Remplis tous les champs.");
            return;
        }

        if (password.length < 6) {
            showMessage(
                "Le mot de passe doit contenir au moins 6 caractères."
            );
            return;
        }

        if (password !== passwordConfirm) {
            showMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Création du compte...";
        }

        try {
            // 1. Créer le compte Firebase
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = credential.user;

            // 2. Enregistrer le pseudo dans le profil Firebase
            await updateProfile(user, {
                displayName: username
            });

            // 3. Enregistrer les informations publiques localement
            localStorage.setItem(
                "yokairaUser",
                JSON.stringify({
                    uid: user.uid,
                    username: username,
                    email: user.email,
                    passion: passion
                })
            );

            // 4. Envoyer les informations à Google Sheets
            // Ne jamais envoyer le mot de passe.
            //
            // no-cors ne permet pas de confirmer que
            // Google Sheets a réellement enregistré la ligne.
            try {
                await fetch(SHEETS_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: username,
                        email: user.email,
                        passion: passion,
                        message: ""
                    })
                });
            } catch (sheetsError) {
                console.error(
                    "Échec de la tentative d'envoi à Google Sheets :",
                    sheetsError
                );
            }

            // 5. Rediriger vers le profil
            window.location.replace("./profil.html");

        } catch (error) {
            console.error("Erreur d'inscription :", error);

            const messages = {
                "auth/email-already-in-use":
                    "Cette adresse e-mail possède déjà un compte.",

                "auth/invalid-email":
                    "L'adresse e-mail n'est pas valide.",

                "auth/weak-password":
                    "Choisis un mot de passe plus sécurisé.",

                "auth/operation-not-allowed":
                    "L'inscription par e-mail n'est pas activée dans Firebase.",

                "auth/unauthorized-domain":
                    "Ce domaine n'est pas autorisé dans Firebase Authentication.",

                "auth/network-request-failed":
                    "Problème de connexion. Vérifie Internet puis réessaie.",

                "auth/too-many-requests":
                    "Trop de tentatives. Réessaie plus tard."
            };

            showMessage(
                messages[error.code] ||
                "Impossible de créer le compte. Vérifie les informations et réessaie."
            );

        } finally {
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = "Créer mon compte";
            }
        }
    });
}