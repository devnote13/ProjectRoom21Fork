const API = "http://localhost:3000";

function getToken() {
    return localStorage.getItem("token");
}

// ===============================
// GLOBAL UI SYNC (INDEX + ALL PAGES)
// ===============================
async function updateLobbyUI() {

    const token = getToken();

    const signBtns = document.querySelector(".signbtns");
    const profile = document.querySelector(".user-profile");
    const name = document.querySelector(".UsernameDisplay");
    const avatarImg = document.querySelector(".UserAvatar");

    if (!token) {
        if (signBtns) signBtns.style.display = "flex";
        if (profile) profile.style.display = "none";
        return;
    }

    try {
        const res = await fetch(`${API}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!data.success) {
            localStorage.removeItem("token");
            return;
        }

        const user = data.user;

        if (signBtns) signBtns.style.display = "none";
        if (profile) profile.style.display = "flex";

        if (name) name.textContent = user.username;

        // avatar
        const avatar = localStorage.getItem("avatar") || "default.png";
        if (avatarImg) avatarImg.src = avatar;

    } catch (err) {
        console.error("Lobby error:", err);
    }
}

window.addEventListener("load", updateLobbyUI);

// ===============================
// SIGN UP
// ===============================
const signUpBtn = document.querySelector(".SignUp");

if (signUpBtn) {
    signUpBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.querySelector(".UsernameIn")?.value?.trim();
        const email = document.querySelector(".EmailIn")?.value?.trim();
        const password = document.querySelector(".PasswordIn")?.value?.trim();
        const confirm = document.querySelector(".ConfirmPassIn")?.value?.trim();
        const checkbox = document.querySelector(".CheckBoxInput");

        if (!checkbox?.checked) return alert("Agree to Terms");
        if (!username || !email || !password) return alert("Missing fields");
        if (password !== confirm) return alert("Passwords do not match");

        const res = await fetch(`${API}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!data.success) return alert(data.message || "Signup failed");

        alert("Account created. Please sign in.");
        window.location.href = "signin.html";
    });
}

// ===============================
// SIGN IN (FIXED - GLOBAL LOGIN)
// ===============================
const signInBtn = document.querySelector(".SignIn");

if (signInBtn) {
    signInBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const username = document.querySelector(".InUsername")?.value?.trim();
        const password = document.querySelector(".InPassword")?.value?.trim();

        if (!username || !password) return alert("Missing fields");

        const res = await fetch(`${API}/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!data.success) {
            if (data.message === "Your account is banned") {
                alert("🚫 Your account is banned");
            } else {
                alert(data.message || "Login failed");
            }
            return;
        }


        // ONLY TOKEN STORED
        localStorage.setItem("token", data.token);

        window.location.href = "index.html";
    });
}

// ===============================
// LOGOUT (FULL RESET)
// ===============================
document.addEventListener("click", (e) => {

    const btn = e.target.closest(".LogoutBtn");
    if (!btn) return;

    localStorage.clear();

    window.location.href = "index.html";
});

// ===============================
// AVATAR (GLOBAL VISUAL ONLY)
// ===============================
const avatarInput = document.querySelector("#avatarInput");

if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const img = reader.result;

            localStorage.setItem("avatar", img);

            document.querySelectorAll(".UserAvatar").forEach(el => {
                el.src = img;
            });
        };

        reader.readAsDataURL(file);
    });
}