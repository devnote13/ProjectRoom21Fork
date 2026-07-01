
// ===============================
// SNOWFALL AUTH + LOBBY + AVATAR SYSTEM
// ===============================

const regex = /^[a-zA-Z0-9]+$/;

// ===============================
// LOBBY UI (RUN ON MAIN PAGE)
// ===============================
window.addEventListener("load", () => {

    const user = localStorage.getItem("username");
    const avatar = localStorage.getItem("avatar");

    const signBtns = document.querySelector(".signbtns");
    const profile = document.querySelector(".user-profile");
    const name = document.querySelector(".UsernameDisplay");
    const avatarImg = document.querySelector(".UserAvatar");

    if (user) {
        if (signBtns) signBtns.style.display = "none";
        if (profile) profile.style.display = "flex";
        if (name) name.textContent = user;
    } else {
        if (signBtns) signBtns.style.display = "flex";
        if (profile) profile.style.display = "none";
    }

    if (avatar && avatarImg) {
        avatarImg.src = avatar;
    }
});

// ===============================
// SIGN UP PAGE
// ===============================
if (document.querySelector(".UsernameIn")) {

    const SignUpBtn = document.querySelector(".SignUp");

    SignUpBtn?.addEventListener("click", (e) => {
        e.preventDefault();

        const username = document.querySelector(".UsernameIn")?.value?.trim();
        const email = document.querySelector(".EmailIn")?.value?.trim();
        const password = document.querySelector(".PasswordIn")?.value?.trim();
        const confirm = document.querySelector(".ConfirmPassIn")?.value?.trim();
        const checkbox = document.querySelector(".CheckBoxInput");

        if (!checkbox?.checked) return alert("Agree to Terms");

        if (!username) return alert("Missing username");
        if (username.length < 4) return alert("Min 4 characters");
        if (username.length > 20) return alert("Max 20 characters");
        if (!regex.test(username)) return alert("Only letters & numbers");

        if (!email || !email.includes("@")) return alert("Invalid email");

        if (!password || password.length < 8) return alert("Password too short");
        if (!regex.test(password)) return alert("Only letters & numbers");

        if (password !== confirm) return alert("Passwords do not match");

        localStorage.setItem("username", username);

        window.location.href = "index.html";
    });
}

// ===============================
// SIGN IN PAGE
// ===============================
if (document.querySelector(".InUsername")) {

    const SignInBtn = document.querySelector(".SignIn");

    SignInBtn?.addEventListener("click", (e) => {
        e.preventDefault();

        const username = document.querySelector(".InUsername")?.value?.trim();
        const email = document.querySelector(".InEmail")?.value?.trim();
        const password = document.querySelector(".InPassword")?.value?.trim();

        if (!username || !email || !password) {
            return alert("Missing fields");
        }

        localStorage.setItem("username", username);

        window.location.href = "index.html";
    });
}

// ===============================
// LOGOUT
// ===============================
const LogoutBtn = document.querySelector(".LogoutBtn");

if (LogoutBtn) {
    LogoutBtn.addEventListener("click", () => {

        localStorage.removeItem("username");
        localStorage.removeItem("avatar");

        const signBtns = document.querySelector(".signbtns");
        const profile = document.querySelector(".user-profile");
        const name = document.querySelector(".UsernameDisplay");

        if (signBtns) signBtns.style.display = "flex";
        if (profile) profile.style.display = "none";
        if (name) name.textContent = "";

        console.log("Logged out");
    });
}

// ===============================
// AVATAR SYSTEM (CLICK IMAGE TO UPLOAD)
// ===============================
const avatarInput = document.querySelector("#avatarInput");
const avatarImg = document.querySelector(".UserAvatar");

// load saved avatar
window.addEventListener("load", () => {
    const savedAvatar = localStorage.getItem("avatar");

    if (savedAvatar && avatarImg) {
        avatarImg.src = savedAvatar;
    }
});

// change avatar
if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            const imgData = event.target.result;

            if (avatarImg) {
                avatarImg.src = imgData;
            }

            localStorage.setItem("avatar", imgData);
        };

        reader.readAsDataURL(file);
    });
}