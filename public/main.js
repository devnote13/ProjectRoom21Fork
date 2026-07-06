console.log("GAME JS LOADED");
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const searchForm = document.querySelector(".Search-form");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".searchbtn");

const MAX_ROWS = 10;

// -------------------------------
//        Small Databases
// -------------------------------
const UserBase = [
    "JuryDutyGuy",
    "ThePlasma",
    "21_Yeets",
    "PixelNomad",
    "FrostByte",
    "NovaCrate",
    "TurboToast",
    "EchoShift",
    "GlitchPilot",
    "VortexAce",
    "ShadowMint",
    "LuckyOrbit",
    "CosmicPanda",
    "HexRunner",
    "GhostKernel",
    "CrimsonZap",
    "NeonTundra",
    "ZeroVelocity",
    "QuantumGoose",
    "SilentMeteor",
    "Alex99",
    "SnowWolf",
    "LuckyPro",
    "NightSpin"
];

const GameBase = ['Slots', 'Mines', 'BlackJack', 'Roulette', 'Plinko', 'Coin Flip', 'Rock, Paper, Scissors', 'Spin The Wheel'];

// -----------------------------------------

// -----------------------------
//         FUNCTIONS
// -----------------------------

function RandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GetRandomUser(Index) {
    return UserBase[Index];
}

function GetRandomGame(Index) {
    return GameBase[Index];
}

// -----------------------------
//       TABLE SYSTEM
// -----------------------------

function AddRandomRow() {

    const table = document.getElementById("liveTable");
    if (!table) return;

    const game = GetRandomGame(RandomNum(0, GameBase.length - 1));
    const user = GetRandomUser(RandomNum(0, UserBase.length - 1));

    const now = new Date();
    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const bet = RandomNum(10, 500);
    const isWin = Math.random() < 0.55;

    const payout = isWin
        ? "+" + RandomNum(bet, bet * 5)
        : "-" + bet;

    const payoutClass = isWin ? "win" : "loss";

    const header = table.querySelector(".table-header");

    header.insertAdjacentHTML("afterend", `
        <div class="table-row">
            <div>${game}</div>
            <div>${user}</div>
            <div>${time}</div>
            <div>${bet} CHIPS</div>
            <div class="${payoutClass}">${payout} CHIPS</div>
        </div>
    `);

    // Keep only latest MAX_ROWS
    const rows = table.querySelectorAll(".table-row:not(.table-header)");

    if (rows.length > MAX_ROWS) {
        rows[rows.length - 1].remove();
    }

    const waitTime = RandomNum(1, 10) * 1000;
    setTimeout(AddRandomRow, waitTime);
}

// -----------------------------
//     PLAYER SYSTEM
// -----------------------------

function GetAllPlayerElements() {
    return document.querySelectorAll(".live-players");
}

function CalculateTotalPlayers() {
    const elements = GetAllPlayerElements();
    let total = 0;

    elements.forEach(el => {
        const num = parseInt(el.childNodes[0].textContent.replace(/,/g, ""));
        total += isNaN(num) ? 0 : num;
    });

    return total;
}

function AnimateCounter(from, to, element) {
    const duration = 300;
    const start = performance.now();

    function frame(time) {
        const progress = Math.min((time - start) / duration, 1);
        const value = Math.floor(from + (to - from) * progress);

        element.textContent = `${value.toLocaleString()} Players Online`;

        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    }

    requestAnimationFrame(frame);
}

function UpdateLiveCounter() {
    const counter = document.querySelector(".live-counter");
    if (!counter) return;

    const newTotal = CalculateTotalPlayers();

    const current = parseInt(counter.textContent.replace(/,/g, "")) || newTotal;

    AnimateCounter(current, newTotal, counter);
}

function UpdateRandomPlayerCount() {
    const players = GetAllPlayerElements();
    if (!players.length) return;

    const target = players[RandomNum(0, players.length - 1)];

    const action = RandomNum(1, 2);
    const change = RandomNum(1, 10);

    let current = parseInt(target.childNodes[0].textContent.replace(/,/g, ""));

    if (isNaN(current)) current = 0;

    current = action === 1
        ? current + change
        : Math.max(0, current - change);

    target.childNodes[0].textContent = current.toLocaleString();

    UpdateLiveCounter();

    const wait = RandomNum(1, 5) * 1000;
    setTimeout(UpdateRandomPlayerCount, wait);
}


// -----------------------------
//          START
// -----------------------------

window.addEventListener("load", () => {

    // Init counter
    UpdateLiveCounter();

    // Start player system
    setTimeout(UpdateRandomPlayerCount, RandomNum(1, 5) * 1000);

    // Start table system
    setTimeout(AddRandomRow, RandomNum(1, 10) * 1000);
});

// -------------------------------
//          MENU TOGGLE
// --------------------------------

menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    sideMenu.classList.toggle("show");
});

// Close when clicking outside
document.addEventListener("click", function () {
    sideMenu.classList.remove("show");
});

// Don't close when clicking inside the menu
sideMenu.addEventListener("click", function (e) {
    e.stopPropagation();
});

// Close with Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        sideMenu.classList.remove("show");
    }
});

document.querySelector(".GobackBtn").addEventListener("click", () => {
    sideMenu.classList.remove("show");
});


function runSearch() {

    const search = searchInput.value.trim().toLowerCase();
    const cards = document.querySelectorAll(".game-card");

    let firstMatch = null;

    cards.forEach(card => {

        const title = card.querySelector("h3");
        if (!title) return;

        const name = title.textContent.toLowerCase();

        const match = name.includes(search);

        card.style.display = match ? "" : "none";

        if (match && !firstMatch) {
            firstMatch = card;
        }
    });

    // reset
    if (search === "") {
        cards.forEach(card => card.style.display = "");
        return;
    }

    // scroll to first match
    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

async function playGame(gameId) {

    const token = localStorage.getItem("token");

    // default routes (cleaner than switch-case long term)
    const routes = {
        1: "Games/blackjack.html",
        2: "Games/roulette.html",
        3: "Games/plinko.html",
        4: "Games/coinflip.html",
        5: "Games/R.P.S.html",
        6: "Games/S.T.W.html",
        7: "Games/mines.html",
        8: "Games/slots.html"
    };

    // save last played (don’t block navigation if it fails)
    if (token) {
        fetch(`${API}/last-played`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ gameId })
        }).catch(err => console.error("last-played error:", err));
    }

    console.log("Opening game:", gameId);

    const url = routes[gameId];

    if (!url) {
        alert("Game not found");
        return;
    }

    // slight delay (optional, but safe)
    setTimeout(() => {
        window.location.href = url;
    }, 80);
}

// INPUT typing search
searchInput.addEventListener("input", runSearch);

// BUTTON click search
searchBtn.addEventListener("click", runSearch);

// STOP FORM REFRESH (extra safety)
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
});