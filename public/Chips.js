// ========================================
// PURCHASE
// ========================================

const purchaseForm = document.querySelector(".purchase-form");
const purchaseOptions = document.querySelector(".payment-options");

const purchaseInput = document.getElementById("purchaseAmount");
const purchaseBtn = document.getElementById("purchaseBtn");

// ========================================
// WITHDRAW
// ========================================

const withdrawForm = document.querySelector(".withdraw-form");
const withdrawOptions = document.querySelector(".withdraw-options");

const withdrawInput = document.getElementById("withdrawAmount");
const withdrawBtn = document.getElementById("withdrawBtn");

// ========================================
// PURCHASE
// ========================================

purchaseBtn?.addEventListener("click", () => {

    const amount = Number(purchaseInput.value);

    if (isNaN(amount) || amount <= 0) {
        alert("Enter a valid chip amount.");
        purchaseInput.focus();
        return;
    }

    purchaseForm.style.display = "none";
    purchaseOptions.style.display = "block";

    purchaseOptions.insertAdjacentHTML("afterbegin", `
        <p class="payment-summary">
            Purchasing <b>${amount.toLocaleString()}</b> Chips
            <br>
            Total: <b>$${amount.toLocaleString()}</b>
        </p>
    `);

});

// ========================================
// WITHDRAW
// ========================================

withdrawBtn?.addEventListener("click", () => {

    const amount = Number(withdrawInput.value);

    if (isNaN(amount) || amount <= 0 || amount > 50) {
        alert("Minimum Withdrawal Is 50 Chips");
        withdrawInput.focus();
        return;
    }

    withdrawForm.style.display = "none";
    withdrawOptions.style.display = "block";

    withdrawOptions.insertAdjacentHTML("afterbegin", `
        <p class="payment-summary">
            Withdrawing <b>${amount.toLocaleString()}</b> Chips
            <br>
            You will receive <b>$${amount.toLocaleString()}</b>
        </p>
    `);

});


// ========================================
// BACK BUTTONS
// ========================================

function addBackButtons() {

    if (purchaseOptions && !purchaseOptions.querySelector(".back-btn")) {

        purchaseOptions.insertAdjacentHTML("beforeend", `
            <button class="back-btn">
                Back
            </button>
        `);

        purchaseOptions.querySelector(".back-btn").addEventListener("click", () => {

            purchaseOptions.style.display = "none";
            purchaseForm.style.display = "block";

            purchaseOptions.querySelector(".payment-summary")?.remove();
            purchaseOptions.querySelector(".back-btn")?.remove();

        });

    }

    if (withdrawOptions && !withdrawOptions.querySelector(".back-btn")) {

        withdrawOptions.insertAdjacentHTML("beforeend", `
            <button class="back-btn">
                Back
            </button>
        `);

        withdrawOptions.querySelector(".back-btn").addEventListener("click", () => {

            withdrawOptions.style.display = "none";
            withdrawForm.style.display = "block";

            withdrawOptions.querySelector(".payment-summary")?.remove();
            withdrawOptions.querySelector(".back-btn")?.remove();

        });

    }

}

// ========================================
// WATCH FOR PAYMENT SECTIONS
// ========================================

const observer = new MutationObserver(addBackButtons);

if (purchaseOptions) {
    observer.observe(purchaseOptions, {
        childList: true
    });
}

if (withdrawOptions) {
    observer.observe(withdrawOptions, {
        childList: true
    });
}