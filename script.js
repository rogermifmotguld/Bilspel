const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Inställningar för bilens position och dimensioner
const carWidth = 20; // Bilens bredd
const carHeight = 20; // Bilens höjd
let carX = 400 - carWidth / 2; // Startposition X (centrerad på linjen)
let carY = 90; // Startposition Y (precis ovanför linjen)
let carSpeed = 3; // Bilens hastighet
let keys = {}; // För tangenttryckningar
let isRestarting = false; // Indikator för om spelet är i omstartsfas

// Klockor och tidmätning
let startTime = Date.now(); // När spelet börjar
let lapStartTime = Date.now(); // När ett varv börjar
let bestLapTime = Infinity; // Bästa varvtiden
let totalLapTime = 0; // Total tid för alla varv
let currentLapTime = 0; // Tid för aktuellt varv

// Element för att visa klockorna
const currentLapTimeDisplay = document.getElementById("current-lap-time");
const bestLapTimeDisplay = document.getElementById("best-lap-time");
const totalTimeDisplay = document.getElementById("total-time");

// Registrera tangenttryckningar
document.addEventListener("keydown", (e) => {
    if (!isRestarting) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Rita banan och den gröna startlinjen
function drawTrack() {
    // Rita svart bakgrund
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rita vit yttre cirkel (banan)
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(400, 300, 200, 0, Math.PI * 2);
    ctx.fill();

    // Rita svart inre cirkel
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.arc(400, 300, 100, 0, Math.PI * 2);
    ctx.fill();

    // Rita grön startlinje (nu i korrekt längd och placering)
    ctx.beginPath();
    ctx.strokeStyle = "#0F0"; // Grön färg
    ctx.lineWidth = 20; // Linjens tjocklek
    ctx.moveTo(400, 100); // Börja vid banans ytterkant (radie 200)
    ctx.lineTo(400, 300); // Sluta vid banans inre kant (radie 100)
    ctx.stroke();
}

// Rita bilen
function drawCar() {
    ctx.fillStyle = "red";
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

// Uppdatera klockor
function updateTimers() {
    // Beräkna aktuell varvtid
    currentLapTime = (Date.now() - lapStartTime) / 1000;
    currentLapTimeDisplay.textContent = `Aktuell Varvtid: ${currentLapTime.toFixed(2)} s`;

    // Uppdatera visningen av total tid
    const totalTime = totalLapTime + currentLapTime;
    totalTimeDisplay.textContent = `Total Tid: ${totalTime.toFixed(2)} s`;
}

// Kontrollera om bilen är på banan
function isCarOnTrack(x, y) {
    const dx = x - 400; // Avstånd från banans centrum i X-led
    const dy = y - 300; // Avstånd från banans centrum i Y-led
    const distance = Math.sqrt(dx * dx + dy * dy); // Avstånd från centrum

    // Kontrollera om avståndet är inom banans radie
    return distance >= 100 && distance <= 200;
}

// Uppdatera bilens position
function updateCar() {
    if (isRestarting) return;

    let newCarX = carX;
    let newCarY = carY;

    // Hantera tangenttryckningar
    if (keys["ArrowUp"]) newCarY -= carSpeed;
    if (keys["ArrowDown"]) newCarY += carSpeed;
    if (keys["ArrowLeft"]) newCarX -= carSpeed;
    if (keys["ArrowRight"]) newCarX += carSpeed;

    // Kontrollera att bilens mittpunkt är på banan
    const carCenterX = newCarX + carWidth / 2;
    const carCenterY = newCarY + carHeight / 2;

    if (isCarOnTrack(carCenterX, carCenterY)) {
        carX = newCarX;
        carY = newCarY;

        // Kontrollera om bilen korsar startlinjen (y = 100)
        if (carY <= 120 && carY >= 100) {
            const currentLap = (Date.now() - lapStartTime) / 1000;
            totalLapTime += currentLap; // Lägg till aktuell varvtid till totalen
            lapStartTime = Date.now(); // Starta en ny varv-tidmätning

            // Uppdatera bästa varvtiden
            if (currentLap < bestLapTime) {
                bestLapTime = currentLap;
                bestLapTimeDisplay.textContent = `Bästa Varvtid: ${bestLapTime.toFixed(2)} s`;
            }
        }
    } else {
        resetCar();
    }
}

// Starta om bilen
function resetCar() {
    if (isRestarting) return;

    isRestarting = true;
    alert("Du körde av banan! Startar om...");

    // Placera bilen ovanför startlinjen
    carX = 400 - carWidth / 2;
    carY = 90; // Precis ovanför linjen

    // Nollställ tangenttryckningar
    keys = {};

    // Vänta innan spelaren kan styra igen
    setTimeout(() => {
        isRestarting = false;
    }, 500);
}

// Spelloopen
function gameLoop() {
    ctx.clearRect(0, 
