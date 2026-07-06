document.addEventListener("DOMContentLoaded", () => {

    console.log("PLAY AGAIN JS LOADED");

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const section = document.querySelector(".section");
    const goBackBtn = document.querySelector(".GobackBtn");

    /* ---------------- MENU ---------------- */
    if (menuBtn && sideMenu) {

        menuBtn.onclick = (e) => {
            e.stopPropagation();
            sideMenu.classList.toggle("show");
        };

        document.onclick = () => sideMenu.classList.remove("show");

        sideMenu.onclick = (e) => e.stopPropagation();

        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                sideMenu.classList.remove("show");
            }
        };
    }

    if (goBackBtn && sideMenu) {
        goBackBtn.onclick = () => {
            sideMenu.classList.remove("show");
        };
    }

    /* ---------------- LOAD HISTORY ---------------- */
    loadHistory();

    async function loadHistory() {

        const token = localStorage.getItem("token");

        if (!token) {
            section.innerHTML = "<p>Please sign in to see game history.</p>";
            return;
        }

        try {

            const res = await fetch(`${API}/last-played`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await res.json();

            console.log("HISTORY DATA:", data);

            if (!data.success || !data.games || data.games.length === 0) {
                section.innerHTML = "<p>No game history found.</p>";
                return;
            }

            // HEADER
            section.innerHTML = `
                <h2 class="sectionheader">Game History</h2>
                <div class="history-grid"></div>
            `;

            const container = section.querySelector(".history-grid");

            // RENDER ALL GAMES
            data.games.forEach(game => {

                container.innerHTML += `
                    <div class="game-card" onclick="location.href='${game.url || '#'}'">

                        <img src="${game.image || 'default.png'}" class="game-art">

                        <div class="game-info">
                            <div class="game-text">
                                <h3>${game.name || 'Unknown Game'}</h3>
                                <p>${game.played_at ? new Date(game.played_at).toLocaleString() : ''}</p>
                            </div>
                        </div>

                    </div>
                `;
            });

        } catch (err) {
            console.error("HISTORY LOAD ERROR:", err);
            section.innerHTML = "<p>Error loading game history.</p>";
        }
    }

});