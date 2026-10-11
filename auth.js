// ========================================
// YOKAIRA — INSCRIPTION FIREBASE + FIRESTORE
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

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

// ========================================
// CONFIGURATION FIREBASE
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyAGfNN8L3Nepdn8D9ocz9ylVB_6mKbIV_6mKbIV_6mKbIV_6mKbIV_6mKbIV",
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
const db = getFirestore(app);

// ========================================
// GOOGLE SHEETS
// ========================================

const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycby0cUVSselFg2QMtQH4Crob_6WBt_8ojijZQgVHprMED3_Hh5iNLm-EuesuuinAi2mzmg/exec";

// ========================================
// FORMULAIRE D'INSCRIPTION
// ========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document
            .getElementById("registerUsername")
            ?.value.trim();

        const email = document
            .getElementById("registerEmail")
            ?.value.trim();

        const passion = document
            .getElementById("registerPassion")
            ?.value.trim();

        const password = document
            .getElementById("registerPassword")
            ?.value;

        const passwordConfirm = document
            .getElementById("registerPasswordConfirm")
            ?.value;

        const presentation = document
            .getElementById("registerMessage")
            ?.value.trim() || "";

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

        // Vérification des champs
        if (
            !username ||
            !email ||
            !passion ||
            !password ||
            !passwordConfirm
        ) {
            showMessage("Remplis tous les champs obligatoires.");
            return;
        }

        if (username.length < 2 || username.length > 40) {
            showMessage(
                "Le nom doit contenir entre 2 et 40 caractères."
            );
            return;
        }

        if (password.length < 6) {
            showMessage(
                "Le mot de passe doit contenir au moins 6 caractères."
            );
            return;
        }

        if (password !== passwordConfirm) {
            showMessage(
                "Les mots de passe ne correspondent pas."
            );
            return;
        }

        // Désactiver le bouton pendant l'inscription
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = "Création du compte...";
        }

        try {
            // 1. Créer le compte Firebase Authentication
            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = credential.user;

            // 2. Enregistrer le nom public dans Firebase Authentication
            await updateProfile(user, {
                displayName: username
            });

            // 3. Créer le profil public dans Cloud Firestore
            const usernameLower = username
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();

            const userProfile = {
                uid: user.uid,
                username: username,
                usernameLower: usernameLower,
                passion: passion,
                bio: presentation,
                photoURL: user.photoURL || "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            await setDoc(
                doc(db, "users", user.uid),
                userProfile
            );

            // 4. Conserver les informations utiles sur cet appareil
            localStorage.setItem(
                "yokairaUser",
                JSON.stringify({
                    uid: user.uid,
                    username: username,
                    email: user.email,
                    passion: passion
                })
            );

            // 5. Envoyer les informations à Google Sheets
            // L'échec de Google Sheets ne bloque pas l'inscription.
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
                        message: presentation
                    })
                });
            } catch (sheetsError) {
                console.error(
                    "Erreur Google Sheets :",
                    sheetsError
                );
            }

            // 6. Rediriger vers le profil
            window.location.replace("./profil.html");

        } catch (error) {
            console.error(
                "Erreur pendant l'inscription :",
                error
            );

            const messages = {
                "auth/email-already-in-use":
                    "Cette adresse e-mail possède déjà un compte.",

                "auth/invalid-email":
                    "L'adresse e-mail n'est pas valide.",

                "auth/weak-password":
                    "Choisis un mot de passe plus sécurisé.",

                "auth/network-request-failed":
                    "Connexion impossible. Vérifie ta connexion Internet.",

                "permission-denied":
                    "Accès Firestore refusé. Vérifie les règles de sécurité.",

                "unavailable":
                    "Firebase est temporairement indisponible. Réessaie."
            };

            showMessage(
                messages[error.code] ||
                "Impossible de terminer l'inscription. Vérifie la configuration Firebase et réessaie."
            );

        } finally {
            if (registerButton) {
                registerButton.disabled = false;
                registerButton.textContent = "Créer mon compte";
            }
        }
    });
}