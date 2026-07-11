// ==============================
// SETTINGS (EDIT THESE ONLY)
// ==============================

const PAYMENT = {
    usd: 12.00,
    trxPrice: 0.3256,
    wallet: "TD2BC3JTZWHAQtpJcbrSW5SmdAowmTyk9M",
    minutes: 30
};

// ==============================
// ELEMENTS
// ==============================

const usdAmount = document.getElementById("usdAmount");
const trxAmount = document.getElementById("trxAmount");
const trxRate = document.getElementById("trxRate");
const wallet = document.getElementById("wallet");
const timer = document.getElementById("timer");
const copyBtn = document.getElementById("copyBtn");
const paidBtn = document.getElementById("paidBtn");

// ==============================
// LOAD PAYMENT
// ==============================

usdAmount.textContent = "$" + PAYMENT.usd.toFixed(2);

const trx = (PAYMENT.usd / PAYMENT.trxPrice).toFixed(2);

trxAmount.textContent = "≈ " + trx + " TRX";

trxRate.textContent =
"1 TRX ≈ $" + PAYMENT.trxPrice.toFixed(4) + " USD";

wallet.textContent = PAYMENT.wallet;

// ==============================
// COPY
// ==============================

copyBtn.onclick = async function(){

    try{

        await navigator.clipboard.writeText(PAYMENT.wallet);

        copyBtn.innerHTML = "✓";

        copyBtn.style.background="#16a34a";

        setTimeout(function(){

            copyBtn.innerHTML="Copy";
            copyBtn.style.background="#1d4ed8";

        },1500);

    }catch{

        alert("Unable to copy.");

    }

};

// ==============================
// COUNTDOWN (PERSISTS AFTER REFRESH)
// ==============================

// ==============================
// PERSISTENT COUNTDOWN
// ==============================

const PAYMENT_TIME = PAYMENT.minutes * 60;

// Get saved expiry
let expiry = localStorage.getItem("paymentExpiry");

// Create one only if it doesn't exist
if (!expiry) {
    expiry = Date.now() + PAYMENT_TIME * 1000;
    localStorage.setItem("paymentExpiry", expiry);
}

expiry = Number(expiry);

function updateTimer() {

    const remaining = Math.floor((expiry - Date.now()) / 1000);

    // Timer expired
    if (remaining <= 0) {

        timer.innerHTML = "Expired";
        timer.style.color = "#ef4444";

        clearInterval(interval);

        // Wait 2 seconds then start a NEW timer
        setTimeout(() => {

            expiry = Date.now() + PAYMENT_TIME * 1000;

            localStorage.setItem("paymentExpiry", expiry);

            timer.style.color = "#4cff88";

            startTimer();

        },2000);

        return;
    }

    const m = Math.floor(remaining / 60);
    const s = remaining % 60;

    timer.innerHTML =
        String(m).padStart(2,"0") +
        ":" +
        String(s).padStart(2,"0");
}

let interval;

function startTimer(){

    updateTimer();

    interval = setInterval(updateTimer,1000);

}

startTimer();

// ==============================
// REFRESH BUTTON
// ==============================

document.getElementById("refreshRate").onclick=function(){

    this.style.transform="rotate(360deg)";

    this.style.transition=".5s";

    setTimeout(()=>{

        this.style.transform="rotate(0deg)";

    },500);

};

// ==============================
// I'VE PAID
// ==============================

// ==============================
// I'VE PAID
// ==============================

paidBtn.onclick = function () {

    // Prevent multiple clicks
    paidBtn.disabled = true;

    // Change button
    paidBtn.innerHTML = "✔ Payment Submitted";
    paidBtn.style.background =
        "linear-gradient(180deg,#16a34a,#15803d)";

    // Change status card
    const cards = document.querySelectorAll(".info-card");

    cards[1].innerHTML = `
        <div class="left">

            <div class="spinner"></div>

            <span>Payment Submitted</span>

        </div>

        <strong style="color:#16a34a;">
            Verifying...
        </strong>
    `;

    // Wait 10 seconds
    setTimeout(function () {

        // Show payment not received
        cards[1].innerHTML = `
            <div class="left">

                <div style="
                    width:16px;
                    height:16px;
                    border-radius:50%;
                    background:#ef4444;
                    box-shadow:0 0 10px rgba(239,68,68,.5);
                "></div>

                <span>Payment Not Received</span>

            </div>

            <strong style="color:#ef4444;">
                Try Again
            </strong>
        `;

        // Restore button
        paidBtn.disabled = false;
        paidBtn.innerHTML = "✔ I've Paid";
        paidBtn.style.background =
            "linear-gradient(180deg,#21d567,#13a84c)";

        // After 3 more seconds, go back to waiting
        setTimeout(function () {

            cards[1].innerHTML = `
                <div class="left">

                    <div class="orange-dot"></div>

                    <span>Waiting for Payment</span>

                </div>

                <div class="spinner"></div>
            `;

        }, 3000);

    }, 10000);

};

// ==============================
// OPTIONAL
// ==============================

// Future live TRX price:
//
// fetch("https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd")
//
// Then update trxPrice automatically.