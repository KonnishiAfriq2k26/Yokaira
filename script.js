// ========================================
// YOKAIRA — SCRIPT PRINCIPAL
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. ANIMATION DES SECTIONS
    // ========================================

    const sections = document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.15 });

        sections.forEach((section) => observer.observe(section));
    } else {
        sections.forEach((section) => section.classList.add("visible"));
    }

    // ========================================
    // 2. EFFET DU LOGO
    // ========================================

    document.querySelectorAll(".logo").forEach((logo) => {
        logo.addEventListener("click", () => {
            logo.style.transform = "scale(1.1)";

            setTimeout(() => {
                logo.style.transform = "";
            }, 200);
        });
    });

    // ========================================
    // 3. INSCRIPTION À YOKAIRA
    // ========================================

    const joinForm = document.getElementById("joinForm");
    const formMessage = document.getElementById("formMessage");

    const scriptURL =
        "https://script.google.com/macros/s/AKfycby0cUVSselFg2QMtQH4Crob_6WBt_8ojijZQgVHprMED3_Hh5iNLm-EuesuuinAi2mzmg/exec";

    if (joinForm && formMessage) {

        joinForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const passion = document.getElementById("passion").value;
            const message = document.getElementById("message").value.trim();

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

            formMessage.textContent = "Envoi de ton inscription...";

            try {
                await fetch(scriptURL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        passion: passion,
                        message: message
                    })
                });

                formMessage.textContent =
                    "Ta demande a été envoyée. Vérifie le registre YOKAIRA pour confirmer son enregistrement.";

                joinForm.reset();

            } catch (error) {
                console.error("Erreur d'envoi :", error);

                formMessage.textContent =
                    "Impossible d'envoyer ta demande. Vérifie ta connexion et réessaie.";

            } finally {
                if (button) {
                    button.disabled = false;
                    button.textContent = "Rejoindre YOKAIRA";
                }
            }
        });
    }

    // ========================================
    // 4. PROFIL LOCAL TEMPORAIRE
    // ========================================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const username = document
                .getElementById("registerUsername")?.value.trim();

            const email = document
                .getElementById("registerEmail")?.value.trim();

            const password = document
                .getElementById("registerPassword")?.value;

            if (!username || !email || !password) {
                alert("Remplis tous les champs obligatoires.");
                return;
            }

            // Ne jamais conserver le mot de passe dans le navigateur.
            localStorage.setItem("yokairaUser", JSON.stringify({
                username: username,
                email: email
            }));

            alert(
                "Profil local créé. La création de comptes sécurisés sera ajoutée ultérieurement."
            );
        });
    }

    // ========================================
    // 5. CONNEXION TEMPORAIREMENT DÉSACTIVÉE
    // ========================================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            alert(
                "Le système de connexion sécurisé de YOKAIRA n'est pas encore disponible."
            );
        });
    }

    // ========================================
    // 6. AFFICHAGE DU PROFIL
    // ========================================

    const userDisplay = document.getElementById("userDisplay");
    const savedUser = localStorage.getItem("yokairaUser");

    if (userDisplay && savedUser) {
        try {
            const user = JSON.parse(savedUser);
            userDisplay.textContent = user.username || "";
        } catch (error) {
            console.error("Impossible de lire le profil.");
        }
    }

    // ========================================
    // 7. DÉCONNEXION
    // ========================================

    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("yokairaLoggedIn");
            localStorage.removeItem("yokairaUser");

            window.location.href = "index.html";
        });
    }

});