const API = "http://localhost:3000";

// =====================
// ELEMENTS
// =====================
const nameEl = document.querySelector(".account-name");
const emailEl = document.querySelector(".account-email");
const chipsEl = document.querySelector(".account-chips");
const avatar = document.querySelector(".account-avatar");
const avatarInput = document.getElementById("avatarInput");

const topUsername = document.querySelector(".UsernameDisplay");
const topAvatar = document.querySelector(".UserAvatar");
const signBtns = document.querySelector(".signbtns");
const profileTop = document.querySelector(".user-profile");

// =====================
// TOKEN
// =====================
function getToken() {
    return localStorage.getItem("token");
}

// =====================
// RESET UI (GLOBAL FIX)
// =====================
function resetUI() {

    if (nameEl) nameEl.textContent = "Guest";
    if (emailEl) emailEl.textContent = "Not signed in";
    if (chipsEl) chipsEl.textContent = "0";

    if (avatar) avatar.src = "default.png";
    if (topAvatar) topAvatar.src = "default.png";

    if (topUsername) topUsername.textContent = "";

    if (signBtns) signBtns.style.display = "flex";
    if (profileTop) profileTop.style.display = "none";
}

// =====================
// APPLY USER (FULL SYNC FIX)
// =====================
function applyUser(user) {

    if (!user) return;

    // account page
    if (nameEl) nameEl.textContent = user.username;
    if (emailEl) emailEl.textContent = user.email;
    if (chipsEl) chipsEl.textContent = user.chips;

    // top bar
    if (topUsername) topUsername.textContent = user.username;

    // avatar priority:
    // server → localStorage fallback
    const avatarImg =
        localStorage.getItem("avatar") || user.avatar || "default.png";

    if (avatar) avatar.src = avatarImg;
    if (topAvatar) topAvatar.src = avatarImg;

    // UI toggle
    if (signBtns) signBtns.style.display = "none";
    if (profileTop) profileTop.style.display = "flex";
}

// =====================
// LOAD USER (ALWAYS SERVER)
// =====================
async function loadUser() {

    const token = getToken();

    if (!token) return resetUI();

    try {
        const res = await fetch(`${API}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!data.success) {
            localStorage.removeItem("token");
            return resetUI();
        }

        applyUser(data.user);

    } catch (err) {
        console.error("LOAD ERROR:", err);
        resetUI();
    }
}

window.addEventListener("load", loadUser);

// =====================
// UPDATE PROFILE (REAL FIX)
// =====================
async function updateProfile(body) {

    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API}/update-profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!data.success) {
        alert(data.message || "Update failed");
        return;
    }

    // ALWAYS reload from server (fix desync bug)
    await loadUser();
}

// =====================
// BUTTONS
// =====================
document.querySelectorAll(".acc-btn")[0]?.addEventListener("click", async () => {
    const val = prompt("New username:");
    if (!val) return;
    await updateProfile({ username: val });
});

document.querySelectorAll(".acc-btn")[1]?.addEventListener("click", async () => {
    const val = prompt("New email:");
    if (!val) return;
    await updateProfile({ email: val });
});

document.querySelectorAll(".acc-btn")[2]?.addEventListener("click", async () => {
    const val = prompt("New password:");
    if (!val) return;
    await updateProfile({ password: val });
    alert("Password updated");
});

// =====================
// AVATAR FIX (BOTH PAGES SYNC)
// =====================
avatarInput?.addEventListener("change", () => {

    const file = avatarInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        const img = reader.result;

        // update UI instantly
        if (avatar) avatar.src = img;
        if (topAvatar) topAvatar.src = img;

        // save globally
        localStorage.setItem("avatar", img);
    };

    reader.readAsDataURL(file);
});

// =====================
// LOGOUT (FULL GLOBAL FIX)
// =====================
document.addEventListener("click", (e) => {

    const btn = e.target.closest(".logoutBtn");
    if (!btn) return;

    // FULL CLEAR
    localStorage.clear();

    // reset UI everywhere
    resetUI();

    // force clean state
    window.location.href = "index.html";
});