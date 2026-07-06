document.addEventListener("DOMContentLoaded", () => {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const table = document.getElementById("liveTable");

    /* ---------------- MENU ---------------- */
    if (menuBtn && sideMenu) {

        menuBtn.onclick = (e) => {
            e.stopPropagation();
            sideMenu.classList.toggle("show");
        };

        document.onclick = () => sideMenu.classList.remove("show");

        sideMenu.onclick = (e) => e.stopPropagation();

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                sideMenu.classList.remove("show");
            }
        });
    }

    /* ---------------- LOAD BETS ---------------- */
    loadBets();

    async function loadBets() {

        console.log("LOADING BETS...");

        const token = localStorage.getItem("token");

        if (!token) {
            table.innerHTML += `
                <div class="table-row">
                    <div colspan="5">Please sign in to view bets</div>
                </div>
            `;
            return;
        }

        try {

            const res = await fetch(`${API}/my-bets`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            const data = await res.json();

            console.log("BETS DATA:", data);

            if (!data.success || !data.bets || data.bets.length === 0) {
                table.innerHTML += `
                    <div class="table-row">
                        <div colspan="5">No bets found</div>
                    </div>
                `;
                return;
            }

            // RENDER BETS
            data.bets.forEach(bet => {

                const payoutClass = bet.payout && bet.payout.startsWith("+")
                    ? "win"
                    : "loss";

                table.insertAdjacentHTML("beforeend", `
                    <div class="table-row">

                        <div>${bet.game || "Unknown"}</div>
                        <div>${bet.username || "You"}</div>
                        <div>${bet.time || "-"}</div>
                        <div>${bet.bet || 0} CHIPS</div>

                        <div class="${payoutClass}">
                            ${bet.payout || "0"}
                        </div>

                    </div>
                `);

            });

        } catch (err) {
            console.error("FAILED TO LOAD BETS:", err);

            table.innerHTML += `
                <div class="table-row">
                    <div colspan="5">Error loading bets</div>
                </div>
            `;
        }
    }

});
