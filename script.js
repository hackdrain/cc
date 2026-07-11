/* ==========================================
   CRYPTOCRACKER
   PART 1
========================================== */

// -----------------------------
// Crypto Data
// -----------------------------

const cryptoList = [

    {
        name:"BTC",
        image:"https://cryptologos.cc/logos/bitcoin-btc-logo.png"
    },

    {
        name:"ETH",
        image:"https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },

    {
        name:"LTC",
        image:"https://cryptologos.cc/logos/litecoin-ltc-logo.png"
    },

    {
        name:"BNB",
        image:"https://cryptologos.cc/logos/bnb-bnb-logo.png"
    },

    {
        name:"DOGE",
        image:"https://cryptologos.cc/logos/dogecoin-doge-logo.png"
    },

    {
        name:"XRP",
        image:"https://cryptologos.cc/logos/xrp-xrp-logo.png"
    },

    {
        name:"TRX",
        image:"https://cryptologos.cc/logos/tron-trx-logo.png"
    },

    {
        name:"SOL",
        image:"https://cryptologos.cc/logos/solana-sol-logo.png"
    },

    {
        name:"USDT",
        image:"https://cryptologos.cc/logos/polygon-pol-logo.png"
    }

];

// -----------------------------
// Word List
// -----------------------------

const wordList=[

"apple","binary","crypto","delta","energy",
"future","galaxy","hash","icon","jungle",
"kernel","ledger","matrix","node","oracle",
"pixel","quantum","random","signal","token",
"unified","vector","wallet","xenon","yield","zero"

];

// -----------------------------
// HTML Elements
// -----------------------------

const grid=document.getElementById("grid");

const startBtn=document.getElementById("startBtn");

const loading=document.getElementById("loading");

const page1=document.getElementById("page1");

const page2=document.getElementById("page2");

const selectedRow=document.getElementById("selectedRow");

const mnemonicBox=document.getElementById("mnemonicBox");

const generatedCountEl=document.getElementById("generatedCount");

const foundCountEl=document.getElementById("foundCount");

const foundResult=document.getElementById("foundResult");

const foundPhrase=document.getElementById("foundPhrase");

const copyPhraseBtn=document.getElementById("copyPhraseBtn");

const popup=document.getElementById("dailyPopup");

const countdown=document.getElementById("countdown");

const getKeyBtn=document.getElementById("getKeyBtn");

const backBtn=document.getElementById("backBtn");

// -----------------------------
// Variables
// -----------------------------

let selected=[];

let generatedCount=0;

let foundShown=false;

let fullPhrase="";

let generator=null;

let foundTimer=null;

let stopTimer=null;

// -----------------------------
// Daily Limit
// -----------------------------

const DAILY_KEY="daily_limit_time";

// -----------------------------
// Build Crypto Grid
// -----------------------------

cryptoList.forEach((coin,index)=>{

    const item=document.createElement("div");

    item.className="item";

    const box=document.createElement("div");

    box.className="box";

    box.innerHTML=`
        <img src="${coin.image}">
    `;

    const label=document.createElement("div");

    label.className="label";

    label.innerText=coin.name;

    box.onclick=()=>{

        const exist=selected.indexOf(index);

        if(exist!==-1){

            selected.splice(exist,1);

            box.classList.remove("selected");

        }

        else{

            if(selected.length>=4){

                alert("Only four cryptocurrencies can be selected.");

                return;

            }

            selected.push(index);

            box.classList.add("selected");

        }

    };

    item.appendChild(box);

    item.appendChild(label);

    grid.appendChild(item);

});

// -----------------------------
// Check Daily Limit
// -----------------------------

window.onload=()=>{

    const saved=localStorage.getItem(DAILY_KEY);

    if(!saved) return;

    const end=parseInt(saved);

    if(Date.now()<end){

        showLimitPopup(end);

    }

    else{

        localStorage.removeItem(DAILY_KEY);

    }

};

/* ==========================================
   PART 2
   START BUTTON + GENERATOR
========================================== */

// Start Button
startBtn.onclick = () => {

    if (selected.length !== 4) {

        alert("Please select exactly four cryptocurrencies.");

        return;

    }

    loading.style.display = "flex";

    setTimeout(() => {

        loading.style.display = "none";

        page1.classList.remove("active");

        page2.classList.add("active");

        renderSelectedCoins();

        startGenerator();

    },3000);

};


// -----------------------------
// Render Selected Coins
// -----------------------------

function renderSelectedCoins(){

    selectedRow.innerHTML="";

    selected.forEach(index=>{

        const box=document.createElement("div");

        box.className="box selected";

        box.innerHTML=`
            <img src="${cryptoList[index].image}">
        `;

        selectedRow.appendChild(box);

    });

}


// -----------------------------
// Generate Mnemonic
// -----------------------------

function generateMnemonic(){

    let words=[];

    for(let i=0;i<12;i++){

        words.push(
            wordList[
                Math.floor(Math.random()*wordList.length)
            ]
        );

    }

    return words.join(" ");

}


// -----------------------------
// Start Generator
// -----------------------------

function startGenerator(){

    generator=setInterval(()=>{

        const phrase=generateMnemonic();

        let preview=phrase.substring(0,24);

        const lastSpace=preview.lastIndexOf(" ");

        if(lastSpace!==-1){

            preview=preview.substring(0,lastSpace);

        }

        const line=document.createElement("div");

        line.className="line";

        line.innerHTML="GeneratedPhrase : "+preview+"...";

        mnemonicBox.appendChild(line);

        mnemonicBox.scrollTop=mnemonicBox.scrollHeight;

        generatedCount++;

        generatedCountEl.innerHTML=
        "Generated : "+generatedCount;

    },100);

}

/* ==========================================
   PART 3
   FOUND WALLET
========================================== */

function startFoundTimer(){

    foundTimer = setTimeout(()=>{

        if(foundShown) return;

        foundShown = true;

        foundCountEl.innerHTML = "Found : 1";

        const words=[];

        for(let i=0;i<12;i++){

            words.push(
                wordList[
                    Math.floor(Math.random()*wordList.length)
                ]
            );

        }

        fullPhrase = words.join(" ");

        foundPhrase.innerHTML =
            "Phrase : " +
            words.slice(0,4).join(" ") +
            " ...";

        foundResult.style.display = "block";

    },30000000);

}


/* ==========================================
   COPY PHRASE
========================================== */

copyPhraseBtn.onclick = ()=>{

    if(fullPhrase==="") return;

    navigator.clipboard.writeText(fullPhrase);

    copyPhraseBtn.innerHTML="Copied ✓";

    setTimeout(()=>{

        copyPhraseBtn.innerHTML="Copy Phrase";

    },1500);

};

/* ==========================================
   PART 4
   DAILY LIMIT SYSTEM
========================================== */

// -----------------------------
// Stop after 10 seconds
// -----------------------------

function startDailyLimit(){

    stopTimer = setTimeout(()=>{

        // Stop generating
        clearInterval(generator);

        // Stop wallet timer
        clearTimeout(foundTimer);

        // Save unlock time (24 hours)
        const unlockTime = Date.now() + (24 * 60 * 60 * 1000);

        localStorage.setItem(
            DAILY_KEY,
            unlockTime
        );

        // Show popup
        showLimitPopup(unlockTime);

    },300000);

}


// -----------------------------
// Show Popup
// -----------------------------

function showLimitPopup(unlockTime){

    popup.style.display="flex";

    updateCountdown(unlockTime);

    const countdownTimer = setInterval(()=>{

        const now = Date.now();

        if(now >= unlockTime){

            clearInterval(countdownTimer);

            localStorage.removeItem(DAILY_KEY);

            popup.style.display="none";

            location.reload();

            return;

        }

        updateCountdown(unlockTime);

    },1000);

}


// -----------------------------
// Update Countdown
// -----------------------------

function updateCountdown(unlockTime){

    let diff = unlockTime - Date.now();

    let hours =
        Math.floor(diff / 1000 / 60 / 60);

    let minutes =
        Math.floor(diff / 1000 / 60) % 60;

    let seconds =
        Math.floor(diff / 1000) % 60;

    countdown.innerHTML =

        String(hours).padStart(2,"0")
        + ":"
        + String(minutes).padStart(2,"0")
        + ":"
        + String(seconds).padStart(2,"0");

}


// -----------------------------
// Buttons
// -----------------------------

getKeyBtn.onclick = ()=>{

    // Change this to your page
    location.href="getactivationkey.html";

};

backBtn.onclick = ()=>{

    // Change this to your page
    location.href="cryptocrackerhome.html";

};


/* ==========================================
   MODIFY startGenerator()
========================================== */

/*
Replace your current startGenerator()
with the one below.
*/

function startGenerator(){

    generator = setInterval(()=>{

        const phrase = generateMnemonic();

        let preview = phrase.substring(0,24);

        const lastSpace = preview.lastIndexOf(" ");

        if(lastSpace!=-1){

            preview=preview.substring(0,lastSpace);

        }

        const line=document.createElement("div");

        line.className="line";

        line.innerHTML="GeneratedPhrase : "+preview+"...";

        mnemonicBox.appendChild(line);

        mnemonicBox.scrollTop=
            mnemonicBox.scrollHeight;

        generatedCount++;

        generatedCountEl.innerHTML=
            "Generated : "+generatedCount;

    },50);

    // Show wallet after 30 sec
    startFoundTimer();

    // Stop after 10 sec
    startDailyLimit();

}
