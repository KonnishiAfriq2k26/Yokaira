// =========================
// YOKAIRA — SCRIPT PRINCIPAL
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // APPARITION DES SECTIONS
    // =========================

    const sections = document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.15 }
        );

        sections.forEach((section) => observer.observe(section));
    } else {
        sections.forEach((section) => section.classList.add("visible"));
    }

    // =========================
    // EFFET DU LOGO
    // =========================

    const logo = document.querySelector(".logo");

    if (logo) {
        logo.addEventListener("click", () => {
            logo.style.transform = "scale(1.1)";

            setTimeout(() => {
                logo.style.transform = "scale(1)";
            }, 200);
        });
    }

    // =========================
    // INSCRIPTION COMMUNAUTAIRE
    // GOOGLE SHEETS
    // =========================

    const joinForm = document.getElementById("joinForm");
    const formMessage = document.getElementById("formMessage");

    const scriptURL =
        "https://script.google.com/macros/s/AKfycby0cUVSselFg2QMtQH4Crob_6WBt_8ojijZQgVHprMED3_Hh5iNLm-EuesuuinAi2mzmg/exec";

    if (joinForm && formMessage) {
        joinForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const passion = document.getElementById("passion")?.value;
            const message = document.getElementById("message")?.value.trim();

            if (!name || !email || !passion) {
                formMessage.textContent =
                    "Remplis tous les champs obligatoires.";
                return;
            }

            const button = joinForm.querySelector('button[type="submit"]');

            if (button) {
                button.disabled = true;
                button.textContent = "Envoi en cours...";
            }

            formMessage.textContent = "Envoi de ta demande...";

            try {
                await fetch(scriptURL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        passion,
                        message
                    })
                });

                // En mode no-cors, la réponse de Google
                // ne peut pas confirmer l'enregistrement.
                formMessage.textContent =
                    "Demande envoyée. L'équipe doit vérifier ton inscription dans le registre.";

                joinForm.reset();

            } catch (error) {
                formMessage.textContent =
                    "Échec de l'envoi. Vérifie ta connexion et réessaie.";
            } finally {
                if (button) {
                    button.disabled = false;
                    button.textContent = "Rejoindre YOKAIRA";
                }
            }
        });
    }

    // =========================
    // CRÉATION DE COMPTE
    // =========================

    const registerForm = document.querySelector("#registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document
                .querySelector("#registerUsername")?.value.trim();

            const email = document
                .querySelector("#registerEmail")?.value.trim();

            const password = document
                .querySelector("#registerPassword")?.value;

            if (!username || !email || !password) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            // Stockage local temporaire seulement.
            // Ne pas utiliser ce système pour de vrais comptes.
            const user = { username, email };

            localStorage.setItem("yokairaUser", JSON.stringify(user));

            // Attention : ce stockage local n'est pas un système
            // d'authentification sécurisé.
            alert(
                "Profil local créé. Le système de comptes sécurisé reste à mettre en place."
            );
        });
    }

    // =========================
    // CONNEXION
    // =========================

    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            alert(
                "La connexion sécurisée n'est pas encore configurée. Elle sera ajoutée avec le véritable système de comptes YOKAIRA."
            );
        });
    }

    // =========================
    // AFFICHAGE DU NOM UTILISATEUR
    // =========================

    const userDisplay = document.querySelector("#userDisplay");
    const savedUser = localStorage.getItem("yokairaUser");

    if (userDisplay && savedUser) {
        try {
            const user = JSON.parse(savedUser);
            userDisplay.textContent = user.username || "";
        } catch (error) {
            console.error("Profil local illisible.");
        }
    }

    // =========================
    // DÉCONNEXION
    // =========================

    const logoutButton = document.querySelector("#logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("yokairaLoggedIn");
            window.location.href = "index.html";
        });
    }

});