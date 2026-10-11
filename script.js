// ========================================
// YOKAIRA — SCRIPT PRINCIPAL
// Animations et fonctions communes
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------
    // 1. ANIMATION D'APPARITION DES SECTIONS
    // ------------------------------------

    const sections = document.querySelectorAll("section");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
    } else {
        // Compatibilité avec les navigateurs anciens
        sections.forEach((section) => {
            section.classList.add("visible");
        });
    }

    // ------------------------------------
    // 2. PETIT EFFET SUR LE LOGO
    // ------------------------------------

    const logos = document.querySelectorAll(".logo");

    logos.forEach((logo) => {
        logo.addEventListener("click", () => {
            logo.style.transform = "scale(1.05)";

            window.setTimeout(() => {
                logo.style.transform = "";
            }, 200);
        });
    });

    // ------------------------------------
    // 3. AFFICHAGE DU NOM DU MEMBRE
    // ------------------------------------
    // Ce bloc affiche uniquement les informations
    // déjà enregistrées localement.
    // Firebase reste responsable de l'authentification.

    const userDisplay = document.getElementById("userDisplay");

    if (userDisplay) {
        try {
            const savedUser = localStorage.getItem("yokairaUser");

            if (savedUser) {
                const user = JSON.parse(savedUser);

                userDisplay.textContent =
                    user.username || user.email || "Membre YOKAIRA";
            } else {
                userDisplay.textContent = "Visiteur";
            }
        } catch (error) {
            console.error(
                "Impossible de lire le profil local :",
                error
            );

            userDisplay.textContent = "Membre YOKAIRA";
        }
    }

    // ------------------------------------
    // 4. SÉCURITÉ DES FORMULAIRES
    // ------------------------------------
    // IMPORTANT :
    // Ce fichier ne gère plus registerForm ou loginForm.
    // L'inscription doit être gérée par auth.js.
    // La connexion doit être gérée par Firebase.
    //
    // On ne bloque donc pas leurs événements submit.

});