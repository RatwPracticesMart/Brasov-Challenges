// ======================================================
// SCREENS
// ======================================================

const menuScreen = document.getElementById("menuScreen");
const gateScreen = document.getElementById("gateScreen");
const factualScreen = document.getElementById("factualScreen");

// ======================================================
// MENU BUTTONS
// ======================================================

const btnGate = document.getElementById("btnGate");
const btnFactual = document.getElementById("btnFactual");

// ======================================================
// BACK BUTTONS
// ======================================================

const backButtons = document.querySelectorAll(".backButton");

// ======================================================
// SCREEN FUNCTIONS
// ======================================================

function hideAllScreens() {

    menuScreen.classList.add("hidden");
    gateScreen.classList.add("hidden");
    factualScreen.classList.add("hidden");

}

function showMenu() {

    hideAllScreens();
    menuScreen.classList.remove("hidden");

}

function showGate() {

    hideAllScreens();
    gateScreen.classList.remove("hidden");

}

function showFactual() {

    hideAllScreens();
    factualScreen.classList.remove("hidden");

}

// ======================================================
// FACTUAL - UNDO / RESET
// ======================================================

const clear = document.getElementById("clear");
const resetFactual = document.getElementById("resetFactual");

// ======================================================
// EVENTS
// ======================================================

btnGate.addEventListener("click", () => {

    showGate();

});

btnFactual.addEventListener("click", () => {

    showFactual();

});

backButtons.forEach(button => {

    button.addEventListener("click", () => {

        showMenu();

    });

});

// ======================================================
// START
// ======================================================

showMenu();

// ======================================================
// CATHERINE'S GATE - PART 2A
// ======================================================

const slots = document.querySelectorAll(".slot");
const letters = document.querySelectorAll(".letter");

const missingText = document.getElementById("missingText");

let selectedLetter = null;
let selectedSlot = null;

// ======================================================
// UNDO
// ======================================================

const undo = document.getElementById("undo");

let history = [];

// FIX 1: Added "click" event type
undo.addEventListener("click", () => {

    if (history.length === 0)
        return;

    restoreState(history.pop());

});
// ------------------------------------------------------
// Update Missing Letters
// ------------------------------------------------------

function updateMissingLetters() {

    const missing = [];

    letters.forEach(letter => {

        if (!letter.classList.contains("used")) {

            missing.push(letter.dataset.letter);

        }

    });

    missingText.textContent =
        missing.length ? missing.join(", ") : "None ✅";

}

// ------------------------------------------------------
// Clear Selection
// ------------------------------------------------------

function clearSelections() {

    letters.forEach(letter =>
        letter.classList.remove("selected")
    );

    slots.forEach(slot =>
        slot.classList.remove("selected")
    );

    selectedLetter = null;
    selectedSlot = null;

}

// ------------------------------------------------------
// Save Board
// ------------------------------------------------------

function saveState() {

    const state = {

        slots: [],
        used: []

    };

    slots.forEach(slot => {

        state.slots.push(slot.textContent);

    });

    letters.forEach(letter => {

        state.used.push(letter.classList.contains("used"));

    });

    history.push(state);

}

// ------------------------------------------------------
// Restore Board
// ------------------------------------------------------

function restoreState(state) {

    clearSelections();

    slots.forEach((slot, index) => {

        const value = state.slots[index];
        
        // Check if the value is a number (1-7) or empty indicator
        if (value === "?" || value === "1" || value === "2" || value === "3" || 
            value === "4" || value === "5" || value === "6" || value === "7") {
            // It's empty - show the number
            slot.textContent = index + 1;
            slot.classList.remove("filled");
        } else {
            // It's a letter
            slot.textContent = value;
            slot.classList.add("filled");
        }

    });

    letters.forEach((letter, index) => {

        if (state.used[index]) {

            letter.classList.add("used");
            letter.style.visibility = "hidden";

        } else {

            letter.classList.remove("used");
            letter.style.visibility = "visible";

        }

    });

    updateMissingLetters();

}

// ------------------------------------------------------
// LETTER CLICK
// ------------------------------------------------------

letters.forEach(letter => {

    letter.addEventListener("click", () => {

        if (letter.classList.contains("used"))
            return;

        slots.forEach(slot =>
            slot.classList.remove("selected")
        );

        letters.forEach(l =>
            l.classList.remove("selected")
        );

        letter.classList.add("selected");

        selectedLetter = letter;
        selectedSlot = null;

    });

});
// ------------------------------------------------------
// SLOT CLICK
// ------------------------------------------------------

slots.forEach(slot => {

    slot.addEventListener("click", () => {

            // =====================================================
            // CASE 1: Place letter into EMPTY slot
            // =====================================================
            if (selectedLetter && (slot.textContent === "?" || slot.textContent === "1" || slot.textContent === "2" || 
                slot.textContent === "3" || slot.textContent === "4" || slot.textContent === "5" || 
                slot.textContent === "6" || slot.textContent === "7")) {
                saveState();
                slot.textContent = selectedLetter.dataset.letter;
                slot.classList.add("filled");
                selectedLetter.classList.add("used");
                selectedLetter.style.visibility = "hidden";
                clearSelections();
                updateMissingLetters();
                return;
            }

        // =====================================================
        // CASE 2: Replace letter in FILLED slot with selected letter
        // =====================================================
        if (selectedLetter && slot.textContent !== "?") {
            saveState();
            
            // Get the letter currently in the slot
            const currentLetter = slot.textContent;
            
            // Find the letter element on the right side that matches
            let currentLetterElement = null;
            letters.forEach(letter => {
                if (letter.dataset.letter === currentLetter && letter.classList.contains("used")) {
                    currentLetterElement = letter;
                }
            });
            
            // Put the current letter back on the right side
            if (currentLetterElement) {
                currentLetterElement.classList.remove("used");
                currentLetterElement.style.visibility = "visible";
            }
            
            // Place the selected letter into the slot
            slot.textContent = selectedLetter.dataset.letter;
            slot.classList.add("filled");
            
            // Hide the selected letter
            selectedLetter.classList.add("used");
            selectedLetter.style.visibility = "hidden";
            
            clearSelections();
            updateMissingLetters();
            return;
        }

        // =====================================================
        // CASE 3: Select or Swap filled slots (no letter selected)
        // =====================================================
        if (!selectedLetter && slot.textContent !== "?") {
            
            // 3a: No slot selected yet -> select this one
            if (!selectedSlot) {
                slots.forEach(s => s.classList.remove("selected"));
                slot.classList.add("selected");
                selectedSlot = slot;
                return;
            }
            
            // 3b: Clicking the same selected slot -> deselect it
            if (selectedSlot === slot) {
                slot.classList.remove("selected");
                selectedSlot = null;
                return;
            }
            
            // 3c: Clicking a different filled slot -> SWAP
            if (selectedSlot && selectedSlot !== slot) {
                saveState();
                
                // Swap the letters
                const temp = selectedSlot.textContent;
                selectedSlot.textContent = slot.textContent;
                slot.textContent = temp;
                
                // Clear selections
                slots.forEach(s => s.classList.remove("selected"));
                selectedSlot = null;
                
                updateMissingLetters();
                return;
            }
        }

            // =====================================================
            // CASE 4: Clicking empty slot with nothing selected
            // =====================================================
            if ((slot.textContent === "?" || slot.textContent === "1" || slot.textContent === "2" || 
                slot.textContent === "3" || slot.textContent === "4" || slot.textContent === "5" || 
                slot.textContent === "6" || slot.textContent === "7") && !selectedLetter && !selectedSlot) {
                // Do nothing
                return;
            }

    });

});

// ------------------------------------------------------
// START
// ------------------------------------------------------

updateMissingLetters();

// ======================================================
// RESET BUTTON
// ======================================================

const resetGate = document.getElementById("resetGate");

resetGate.addEventListener("click", resetGateBoard);

function resetGateBoard() {
    // FIX 3: Removed saveState() - was saving the wrong state
    // saveState();

    clearSelections();

    slots.forEach((slot, index) => {

        slot.textContent = index + 1;
        slot.classList.remove("filled");
        slot.classList.remove("selected");

    });

    letters.forEach(letter => {

        letter.classList.remove("used");
        letter.classList.remove("selected");

        letter.style.visibility = "visible";

    });

    updateMissingLetters();

}

// ======================================================
// AUTO FILL
// ======================================================

const autoFill = document.getElementById("autoFill");

autoFill.addEventListener("click", autoFillBoard);

function autoFillBoard() {
    saveState();

    // Remaining letters
    const remainingLetters = [];

    letters.forEach(letter => {

        if (!letter.classList.contains("used")) {
            remainingLetters.push(letter);
        }

    });

    // Shuffle remaining letters
    for (let i = remainingLetters.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [remainingLetters[i], remainingLetters[j]] =
        [remainingLetters[j], remainingLetters[i]];

    }

    let index = 0;

        slots.forEach(slot => {

            if ((slot.textContent === "?" || slot.textContent === "1" || slot.textContent === "2" || 
                slot.textContent === "3" || slot.textContent === "4" || slot.textContent === "5" || 
                slot.textContent === "6" || slot.textContent === "7") && index < remainingLetters.length) {

                const letter = remainingLetters[index];

                slot.textContent = letter.dataset.letter;

                slot.classList.add("filled");

                letter.classList.add("used");
                letter.style.visibility = "hidden";

                index++;

            }

        });

    clearSelections();
    updateMissingLetters();

}

// ======================================================
// UNDO BUTTON - FACTUAL (Clear Last Edited Input)
// ======================================================

const undoFactual = document.getElementById("undoFactual");

undoFactual.addEventListener("click", ()=>{

    if (editHistory.length === 0) {
        console.log("Nothing to undo");
        return;
    }

    // Get the last entry
    const lastEdit = editHistory.pop();
    
    // Clear the input
    lastEdit.input.value = "";
    lastEdit.input.dispatchEvent(new Event('input')); // Trigger recalculation

});


// ======================================================
// FACTUAL - PART 1
// ======================================================

const selectors = document.querySelectorAll(".selector");

const pairD = document.getElementById("pairD");
const pairE = document.getElementById("pairE");
const pairF = document.getElementById("pairF");
const pairG = document.getElementById("pairG");
const pairH = document.getElementById("pairH");

let selectedBase = "A";

// ------------------------------------------------------
// Update Labels
// ------------------------------------------------------

function updatePairLabels() {

    pairD.textContent = `${selectedBase} + D`;
    pairE.textContent = `${selectedBase} + E`;
    pairF.textContent = `${selectedBase} + F`;
    pairG.textContent = `${selectedBase} + G`;
    pairH.textContent = `${selectedBase} + H`;

}

// ------------------------------------------------------
// Selector Buttons
// ------------------------------------------------------

selectors.forEach(button => {

    button.addEventListener("click", () => {

        selectors.forEach(b =>
            b.classList.remove("active")
        );

        button.classList.add("active");

        selectedBase = button.dataset.base;

        updatePairLabels();

        convertPairInputs();

        solveFactual();

    });

});

// ------------------------------------------------------
// Start
// ------------------------------------------------------

updatePairLabels();

// ======================================================
// FACTUAL - PART 2A (SOLVER)
// ======================================================

const targetInput = document.getElementById("target");

const abInput = document.getElementById("ab");
const acInput = document.getElementById("ac");
const bcInput = document.getElementById("bc");

const adInput = document.getElementById("ad");
const aeInput = document.getElementById("ae");
const afInput = document.getElementById("af");
const agInput = document.getElementById("ag");
const ahInput = document.getElementById("ah");

const valueA = document.getElementById("valueA");
const valueB = document.getElementById("valueB");
const valueC = document.getElementById("valueC");
const valueD = document.getElementById("valueD");
const valueE = document.getElementById("valueE");
const valueF = document.getElementById("valueF");
const valueG = document.getElementById("valueG");
const valueH = document.getElementById("valueH");

let solvedValues = {
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
    G: null,
    H: null
};

function clearSolvedValues() {

    solvedValues = {
        A:null,
        B:null,
        C:null,
        D:null,
        E:null,
        F:null,
        G:null,
        H:null
    };

    valueA.textContent="?";
    valueB.textContent="?";
    valueC.textContent="?";
    valueD.textContent="?";
    valueE.textContent="?";
    valueF.textContent="?";
    valueG.textContent="?";
    valueH.textContent="?";

}

// ======================================================
// FACTUAL - Track Last Edited Input for Undo (With Stack)
// ======================================================

let editHistory = [];

// Function to save the last edited input state
function saveLastInputState(input) {
    // Only save if there's a value
    if (input.value !== "") {
        // Remove any existing entries for this input
        editHistory = editHistory.filter(item => item.input !== input);
        // Add to history
        editHistory.push({
            input: input,
            value: input.value
        });
        // Keep history manageable (max 50)
        if (editHistory.length > 50) {
            editHistory.shift();
        }
    }
}




function solveFactual(){

    clearSolvedValues();

    const AB = Number(abInput.value);
    const AC = Number(acInput.value);
    const BC = Number(bcInput.value);

    if(
        abInput.value === "" ||
        acInput.value === "" ||
        bcInput.value === ""){
        matches.value = "";
        return;
    }

    // Check for invalid inputs (decimals)
    if (!Number.isInteger(AB) || !Number.isInteger(AC) || !Number.isInteger(BC)) {
        matches.value = "Invalid pair inputs - please use whole numbers";
        return;
    }

    const numerator = AB + AC - BC;
    
    // Check if numerator is odd (not divisible by 2)
    if (numerator % 2 !== 0) {
        matches.value = "Impossible values - inputs don't form valid pairs";
        return;
    }

    const A = numerator / 2;
    const B = AB - A;
    const C = AC - A;

    // Check if A, B, C are integers
    if (!Number.isInteger(A) || !Number.isInteger(B) || !Number.isInteger(C)) {
        matches.value = "Impossible values - inputs don't form valid pairs";
        return;
    }

    solvedValues.A = A;
    solvedValues.B = B;
    solvedValues.C = C;

    valueA.textContent = A;
    valueB.textContent = B;
    valueC.textContent = C;

    const baseValue = solvedValues[selectedBase];

    solveExtra(adInput,"D",baseValue);
    solveExtra(aeInput,"E",baseValue);
    solveExtra(afInput,"F",baseValue);
    solveExtra(agInput,"G",baseValue);
    solveExtra(ahInput,"H",baseValue);

    checkTargetMatches();

}

function solveExtra(input, key, base){

    if(input.value === "")
        return;

    const value = Number(input.value);
    
    // Check if input is a valid integer
    if (!Number.isInteger(value)) {
        return;
    }

    const solvedValue = value - base;
    
    // Check if result is an integer
    if (!Number.isInteger(solvedValue)) {
        return;
    }

    solvedValues[key] = solvedValue;
    document.getElementById("value" + key).textContent = solvedValue;

}

// ======================================================
// FACTUAL - Input Event Listeners (Track Last Edit)
// ======================================================

[
targetInput,
abInput,
acInput,
bcInput,
adInput,
aeInput,
afInput,
agInput,
ahInput
].forEach(input=>{

    // On focus: save the current value (for undo)
    input.addEventListener("focus", function() {
        // Only save if there's a value
        if (this.value !== "") {
            saveLastInputState(this);
        }
    });

    // On input: solve and track changes
    input.addEventListener("input", function() {
        solveFactual();
        // Update the saved value as user types
        if (editHistory.length > 0 && editHistory[editHistory.length - 1].input === this) {
            // Update the value in history
            editHistory[editHistory.length - 1].value = this.value;
        }
    });

    // On blur: save the final state
    input.addEventListener("blur", function() {
        if (this.value !== "") {
            saveLastInputState(this);
        }
    });

});

// ======================================================
// FACTUAL - PART 2B (CONVERT PAIRS)
// ======================================================

function convertPairInputs() {

    if (
        solvedValues.A === null ||
        solvedValues.B === null ||
        solvedValues.C === null
    ) return;

    const base = solvedValues[selectedBase];

    if (solvedValues.D !== null)
        adInput.value = base + solvedValues.D;

    if (solvedValues.E !== null)
        aeInput.value = base + solvedValues.E;

    if (solvedValues.F !== null)
        afInput.value = base + solvedValues.F;

    if (solvedValues.G !== null)
        agInput.value = base + solvedValues.G;

    if (solvedValues.H !== null)
        ahInput.value = base + solvedValues.H;

}

// ======================================================
// FACTUAL - PART 2C (TARGET MATCHES)
// ======================================================

const matches = document.getElementById("matches");

function checkTargetMatches() {

    matches.value = "";

    if (targetInput.value === "")
        return;

    const target = Number(targetInput.value);

    const found = [];

    const values = [
        solvedValues.A,
        solvedValues.B,
        solvedValues.C,
        solvedValues.D,
        solvedValues.E,
        solvedValues.F,
        solvedValues.G,
        solvedValues.H
    ];

    const names = [
        "A","B","C","D",
        "E","F","G","H"
    ];

    for(let i=0; i<values.length; i++){

        if(values[i] === null || isNaN(values[i]))
            continue;

        for(let j=i+1; j<values.length; j++){

            if(values[j] === null || isNaN(values[j]))
                continue;

            if(values[i] + values[j] === target){

                found.push(`${names[i]} + ${names[j]} = ${target}`);

            }

        }

    }

    if(found.length === 0){

        matches.value = "No pairs match target.";

    }else{

        matches.value = found.join("\n");

    }

}


// FIX 7: Fixed reset order - don't call solveFactual then clear
// ======================================================
// FACTUAL - Reset All Values
// ======================================================

function resetAllFactualValues() {
    // Reset undo tracking
    editHistory = [];

    // Clear all inputs
    targetInput.value = "";
    abInput.value = "";
    acInput.value = "";
    bcInput.value = "";
    adInput.value = "";
    aeInput.value = "";
    afInput.value = "";
    agInput.value = "";
    ahInput.value = "";

    // Reset selector to A
    selectedBase = "A";
    
    selectors.forEach(button=>{
        button.classList.toggle(
            "active",
            button.dataset.base === "A"
        );
    });

    // Reset labels
    updatePairLabels();

    // Clear solved values
    clearSolvedValues();
    
    // Clear matches
    matches.value = "";

    // Reset solvedValues object
    solvedValues = {
        A: null,
        B: null,
        C: null,
        D: null,
        E: null,
        F: null,
        G: null,
        H: null
    };
}

// ======================================================
// CLEAR AND RESET BUTTONS
// ======================================================

clear.addEventListener("click", () => {
    resetAllFactualValues();
});

resetFactual.addEventListener("click", () => {
    resetAllFactualValues();
});
