let timeLeft = 0;
let timerInterval = null;
let isRunning = false;

const btn = document.getElementById("btn");
const timeInput = document.getElementById("timeInput");
const timeInput2 = document.getElementById("timeInput2");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const timerDisplay = document.getElementById("timerDisplay");
const alarmSound = document.getElementById("alarmSound");

// Vérifier si des données existent dans le localStorage au chargement de la page
window.addEventListener("load", function () {
    let savedTime = localStorage.getItem("timeLeft");
    let savedRunning = localStorage.getItem("isRunning");

    if (savedTime) {
        timeLeft = parseInt(savedTime);
        updateDisplay();
    }

    if (savedRunning === "true" && timeLeft > 0) {
        startTimer(); // Reprendre automatiquement si le minuteur était en cours
    }
});

// Fonction pour démarrer le minuteur
startBtn.addEventListener("click", function () {
    if (isRunning) return;

    let inputMinutes = parseInt(timeInput.value) || 0;
    let inputSeconds = parseInt(timeInput2.value) || 0;

    if (inputMinutes <= 0 && inputSeconds <= 0) {
        alert("Entrez un temps valide !");
        return;
    }

    timeLeft = (inputMinutes * 60) + inputSeconds;
    isRunning = true;

    localStorage.setItem("timeLeft", timeLeft);
    localStorage.setItem("isRunning", "true");

    startTimer();
});

// Fonction pour lancer le minuteur
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            localStorage.setItem("timeLeft", timeLeft);
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            localStorage.removeItem("timeLeft");
            localStorage.removeItem("isRunning");
            alarmSound.play();
            showStopButton();
            timerDisplay.style.color = "red";
        }
    }, 1000);

    updateDisplay();
}

// Fonction pour afficher le bouton d'arrêt du son
function showStopButton() {
    btn.style.display = "block";

    btn.addEventListener("click", function () {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        btn.style.display = "none";
        timerDisplay.style.color = "#333";
    });
}

// Fonction pour mettre en pause le minuteur
pauseBtn.addEventListener("click", function () {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        localStorage.setItem("isRunning", "false");
    }
});

// Fonction pour réinitialiser le minuteur
resetBtn.addEventListener("click", function () {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 0;

    localStorage.removeItem("timeLeft");
    localStorage.removeItem("isRunning");

    updateDisplay();
    timeInput.value = "";
    timeInput2.value = "";
    timerDisplay.innerText = "00:00";
});

// Fonction pour mettre à jour l'affichage du minuteur
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    let chiffre = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    timerDisplay.innerText = chiffre;
}
