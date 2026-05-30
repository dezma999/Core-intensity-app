const poseIcons = {
    crunches: `<path d="M20 70 Q 50 40 80 70" stroke="#38bdf8" stroke-width="4" fill="none"/><circle cx="50" cy="35" r="8" fill="#38bdf8"/>`,
    flutterkicks: `<path d="M20 50 L80 40 M20 60 L80 55" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>`,
    plank: `<path d="M15 60 L85 60" stroke="#10b981" stroke-width="6"/>`,
    bicycle: `<circle cx="35" cy="50" r="12" stroke="#38bdf8" stroke-width="3" fill="none"/><circle cx="65" cy="50" r="12" stroke="#38bdf8" stroke-width="3" fill="none"/>`,
    rest: `<path d="M50 25 L50 75 M35 50 L65 50" stroke="#10b981" stroke-width="4"/>`,
    finish: `<path d="M30 70 L50 30 L70 70 Z" stroke="#fbbf24" stroke-width="4" fill="none"/>`
};

const workoutMovements = [
    { name: "Crunches", status: "WORK", time: 45, iconKey: 'crunches', demo: "💪 Lift shoulders using core." },
    { name: "Rest", status: "REST", time: 15, iconKey: 'rest', demo: "😮 Get ready for Flutter Kicks." },
    { name: "Flutter Kicks", status: "WORK", time: 45, iconKey: 'flutterkicks', demo: "🔥 Alternate kicking low." },
    { name: "Rest", status: "REST", time: 15, iconKey: 'rest', demo: "😮 Plank Hold is next." },
    { name: "Plank Hold", status: "WORK", time: 45, iconKey: 'plank', demo: "👑 Keep your body straight!" },
    { name: "Rest", status: "REST", time: 15, iconKey: 'rest', demo: "😮 Bicycle Crunches next." },
    { name: "Bicycle Crunches", status: "WORK", time: 45, iconKey: 'bicycle', demo: "🚴 Twist elbow to knee." },
    { name: "Rest", status: "REST", time: 15, iconKey: 'finish', demo: "🎉 Awesome work!" }
];

let currentMoveIndex = 0;
let timerDuration = workoutMovements[currentMoveIndex].time;
let activeInterval = null;

const weeklyMealDatabase = {
    mon: [{ type: "Breakfast", label: "Avocado Toast" }, { type: "Lunch", label: "Chicken Salad" }, { type: "Dinner", label: "Salmon & Veggies" }],
    tue: [{ type: "Breakfast", label: "Protein Smoothie" }, { type: "Lunch", label: "Turkey Wraps" }, { type: "Dinner", label: "Beef Stir-Fry" }],
    wed: [{ type: "Breakfast", label: "Oatmeal" }, { type: "Lunch", label: "Tuna Salad" }, { type: "Dinner", label: "Lemon Chicken" }],
    thu: [{ type: "Breakfast", label: "Banana Shake" }, { type: "Lunch", label: "Shrimp Salad" }, { type: "Dinner", label: "Baked Cod" }],
    fri: [{ type: "Breakfast", label: "Scrambled Eggs" }, { type: "Lunch", label: "Chicken Wrap" }, { type: "Dinner", label: "Pork Chop" }],
    sat: [{ type: "Breakfast", label: "Protein Pancakes" }, { type: "Lunch", label: "Burger Wrap" }, { type: "Dinner", label: "Grilled Steak" }],
    sun: [{ type: "Breakfast", label: "Greek Yogurt" }, { type: "Lunch", label: "Lentil Soup" }, { type: "Dinner", label: "Roasted Turkey" }]
};

const startButton = document.getElementById("start-btn");
const currentMoveText = document.getElementById("current-move");
const demoTipText = document.getElementById("exercise-demo-tip");
const statusBadgeElement = document.getElementById("status-badge");
const timerDisplayBox = document.getElementById("time-left");
const currentIntervalText = document.getElementById("current-interval");
const nutritionModalWindow = document.getElementById("nutrition-modal");
const openNutritionBtn = document.getElementById("open-nutrition-btn");
const closeNutritionBtn = document.getElementById("close-nutrition-btn");
const mealsContainerElement = document.getElementById("meals-container");
const weekdayTabsList = document.querySelectorAll(".day-tab");
const canvasRing = document.getElementById("timer-ring");
const ctx = canvasRing.getContext("2d");
const demoSvg = document.getElementById("demo-svg");

function buildInterface() {
    updateTimerText(timerDuration);
    drawVisualRing(1);
    updateDemoVisual(workoutMovements[0].iconKey);
    renderMeals("mon");
}

function updateTimerText(secondsLeft) {
    timerDisplayBox.textContent = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
}

function updateDemoVisual(key) {
    demoSvg.innerHTML = poseIcons[key] || '';
}

function drawVisualRing(percentage) {
    ctx.clearRect(0, 0, 170, 170);
    ctx.beginPath();
    ctx.arc(85, 85, 75, 0, 2 * Math.PI);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 10;
    ctx.stroke();
    
    const statusType = workoutMovements[currentMoveIndex].status;
    ctx.beginPath();
    ctx.arc(85, 85, 75, -Math.PI / 2, (-Math.PI / 2) + (2 * Math.PI * percentage));
    ctx.strokeStyle = statusType === "WORK" ? "#f43f5e" : "#10b981";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.stroke();
}

function processTimerTick() {
    if (timerDuration > 0) {
        timerDuration--;
        updateTimerText(timerDuration);
        drawVisualRing(timerDuration / workoutMovements[currentMoveIndex].time);
    } else {
        currentMoveIndex++;
        if (currentMoveIndex < workoutMovements.length) {
            const nextStep = workoutMovements[currentMoveIndex];
            currentMoveText.textContent = nextStep.name;
            demoTipText.textContent = nextStep.demo;
            statusBadgeElement.textContent = nextStep.status === "WORK" ? "Go Time" : "Recover";
            statusBadgeElement.className = nextStep.status === "WORK" ? "status-work" : "status-rest";
            timerDuration = nextStep.time;
            currentIntervalText.textContent = `${currentMoveIndex + 1} / 8`;
            updateDemoVisual(nextStep.iconKey);
            updateTimerText(timerDuration);
            drawVisualRing(1);
        } else {
            clearInterval(activeInterval);
            activeInterval = null;
            currentMoveText.textContent = "Finished! 👑";
            demoTipText.textContent = "Epic effort!";
            updateDemoVisual('finish');
            startButton.textContent = "START WORKOUT";
            startButton.classList.remove("running");
            currentMoveIndex = 0;
            timerDuration = workoutMovements[0].time;
            currentIntervalText.textContent = "0 / 8";
            drawVisualRing(1);
        }
    }
}

startButton.addEventListener("click", () => {
    if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
        startButton.textContent = "START WORKOUT";
        startButton.classList.remove("running");
    } else {
        activeInterval = setInterval(processTimerTick, 1000);
        startButton.textContent = "PAUSE";
        startButton.classList.add("running");
    }
});

function renderMeals(selectedDay) {
    mealsContainerElement.innerHTML = "";
    weeklyMealDatabase[selectedDay].forEach(mealItem => {
        const cardNode = document.createElement("div");
        cardNode.className = "meal-card";
        cardNode.innerHTML = `
            <div>
                <h4>${mealItem.type}</h4>
                <p>${mealItem.label}</p>
            </div>
            <div class="check-circle">✓</div>
        `;
        cardNode.querySelector(".check-circle").addEventListener("click", () => {
            cardNode.classList.toggle("completed");
        });
        mealsContainerElement.appendChild(cardNode);
    });
}

openNutritionBtn.addEventListener("click", () => nutritionModalWindow.classList.add("active"));
closeNutritionBtn.addEventListener("click", () => nutritionModalWindow.classList.remove("active"));

weekdayTabsList.forEach(tabItem => {
    tabItem.addEventListener("click", () => {
        weekdayTabsList.forEach(item => item.classList.remove("active"));
        tabItem.classList.add("active");
        renderMeals(tabItem.getAttribute("data-day"));
    });
});

window.addEventListener("DOMContentLoaded", buildInterface);


