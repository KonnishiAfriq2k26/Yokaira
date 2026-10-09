// =========================
// YOKAIRA — SCRIPT PRINCIPAL
// =========================

document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // APPARITION DES SECTIONS
    // =========================

    const sections = document.querySelectorAll("section");

    if (sections.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });
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
    // INSCRIPTION
    // =========================

    const registerForm = document.querySelector("#registerForm");

    if (registerForm) {

        registerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const username = document
                .querySelector("#registerUsername")
                ?.value.trim();

            const email = document
                .querySelector("#registerEmail")
                ?.value.trim();

            const password = document
                .querySelector("#registerPassword")
                ?.value;

            if (!username || !password) {
                alert("Veuillez remplir les champs obligatoires.");
                return;
            }

            // Pour l'instant, stockage local temporaire.
            const user = {
                username: username,
                email: email,
                password: password
            };

            localStorage.setItem("yokairaUser", JSON.stringify(user));

            alert("Compte YOKAIRA créé avec succès !");

            window.location.href = "login.html";
        });
    }


    // =========================
    // CONNEXION
    // =========================

    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const username = document
                .querySelector("#loginUsername")
                ?.value.trim();

            const password = document
                .querySelector("#loginPassword")
                ?.value;

            const savedUser = localStorage.getItem("yokairaUser");

            if (!savedUser) {
                alert("Aucun compte YOKAIRA n'a encore été créé.");
                return;
            }

            const user = JSON.parse(savedUser);

            if (
                username === user.username &&
                password === user.password
            ) {

                localStorage.setItem("yokairaLoggedIn", "true");

                alert(`Bienvenue sur YOKAIRA, ${user.username} !`);

                window.location.href = "index.html";

            } else {

                alert("Identifiants incorrects.");

            }
        });
    }


    // =========================
    // AFFICHAGE DU NOM UTILISATEUR
    // =========================

    const userDisplay = document.querySelector("#userDisplay");

    if (userDisplay) {

        const loggedIn = localStorage.getItem("yokairaLoggedIn");
        const savedUser = localStorage.getItem("yokairaUser");

        if (loggedIn === "true" && savedUser) {

            const user = JSON.parse(savedUser);

            userDisplay.textContent = user.username;

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
              // Formulaire Rejoindre YOKAIRA
    const joinForm = document.getElementById("joinForm");
    const formMessage = document.getElementById("formMessage");

    if (joinForm) {
        joinForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();

            formMessage.textContent =
                `Bienvenue dans YOKAIRA, ${name} ! ✦`;

            joinForm.reset();
        });
    }

        });
    }

});