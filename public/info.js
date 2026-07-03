const API = "http://localhost:3000";

function getToken() {
    return localStorage.getItem("token");
}

// BLOCK UNAUTHENTICATED UI OVERRIDES
async function protectPage() {

    const token = getToken();

    if (!token) {
        window.location.href = "/signin.html";
        return;
    }

    try {
        const res = await fetch(`${API}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!data.success) {
            localStorage.removeItem("token");
            window.location.href = "/signin.html";
        }

    } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/signin.html";
    }
}

window.addEventListener("load", protectPage);