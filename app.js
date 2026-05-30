// --- WORKOUT CONFIGURATION ---
const workoutMovements = [
    { name: "Crunches", status: "WORK", time: 45 },
    { name: "Rest", status: "REST", time: 15 },
    { name: "Flutter Kicks", status: "WORK", time: 45 },
    { name: "Rest", status: "REST", time: 15 },
    { name: "Plank Hold", status: "WORK", time: 45 },
    { name: "Rest", status: "REST", time: 15 },
    { name: "Bicycle Crunches", status: "WORK", time: 45 },
    { name: "Rest", status: "REST", time: 15 }
];

let currentMoveIndex = 0;
let timerDuration = workoutMovements[currentMoveIndex].time;
let activeInterval = null;

// --- NUTRITION DATA ---
const weeklyMealDatabase = {
    mon: [
        { type: "Breakfast", label: "Avocado Toast & Egg Whites" },
        { type: "Lunch", label: "Grilled Chicken Protein Bowl" },
        { type: "Dinner", label: "Baked Salmon & Broccoli" }
    ],
    tue: [
        { type: "Breakfast", label: "Berry Protein Smoothie" },
        { type: "Lunch", label: "Turkey Lettuce Wraps" },
        { type: "Dinner", label: "Lean Beef Stir-Fry" }
    ],
    wed: [
        { type: "Breakfast", label: "Oatmeal with Chia Seeds" },
        { type: "Lunch", label: "Quinoa Tuna Salad" },
        { type: "Dinner", label: "Lemon Herb Chicken Breast" }
    ],
    thu: [
        { type: "Breakfast", label: "Peanut Butter Banana Shake" },
        { type: "Lunch", label: "Shrimp Avocado Salad" },
        { type: "Dinner", label: "Baked Cod & Sweet Potato" }
    ],
    fri: [
        { type: "Breakfast", label: "Scrambled Eggs & Spinach" },
        { type: "Lunch", label: "Chicken Caesar Wrap" },
        { type: "Dinner", label: "Lean Pork Chop & Asparagus" }
    ],
    sat: [
        { type: "Breakfast", label: "Protein Pancakes with Berries" },
        { type: "Lunch", label: "Healthy Beef Burger Wrap" },
        { type: "Dinner", label: "Grilled Steak & Side Salad" }
    ],
    sun: [
        { type: "Breakfast", label: "Greek Yogurt Honey Parfait" },
        { type: "Lunch", label: "Vegetable Lentil Soup" },
        { type: "Dinner", label: "Roasted Turkey Breast & Veggies" }
    ]
};

// --- DOM ELEMENTS ---
const startButton = document.getElementById("start-btn");
const currentMoveText = document.getElementById("current-move");
const statusBadgeElement = document.getElementById("status-badge");
const timerDisplayBox = document.getElementById("time-left");
const currentIntervalText = document.getElementById("current-interval");
const nutritionModalWindow = document.getElementById("nutrition-modal");
const openNutritionBtn = document.getElementById("open-nutrition-btn");
const closeNutritionBtn = document.getElementById("close-nutrition-btn");
const mealsContainerElement = document.getElementById("meals-container");
const weekdayTabsList = document.querySelectorAll(".day-tab");

// --- INTERACTIVE ENGINE ---
function buildInterface() {
    updateTimerText(timerDuration);
    renderMeals("mon");
}

function updateTimerText(secondsLeft) {
    timerDisplayBox.textContent = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft;
}

function processTimerTick() {
    if (timerDuration > 0) {
        timerDuration--;
        updateTimerText(timerDuration);
    } else {
        currentMoveIndex++;
        if (currentMoveIndex < workoutMovements.length) {
            const nextStep = workoutMovements[currentMoveIndex];
            currentMoveText.textContent = nextStep.name;
            statusBadgeElement.textContent = nextStep.status === "WORK" ? "Go Time" : "Recover";
            statusBadgeElement.className = nextStep.status === "WORK" ? "status-work" : "status-rest";
            timerDuration = nextStep.time;
            currentIntervalText.textContent = `${Math.ceil((currentMoveIndex + 1) / 2)} / 4`;
            updateTimerText(timerDuration);
        } else {
            clearInterval(activeInterval);
            activeInterval = null;
            currentMoveText.textContent = "Workout Finished! 👑";
            statusBadgeElement.textContent = "Done";
            statusBadgeElement.className = "status-rest";
            startButton.textContent = "START WORKOUT";
            startButton.classList.remove("running");
            currentMoveIndex = 0;
            timerDuration = workoutMovements[0].time;
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
        const primaryStep = workoutMovements[currentMoveIndex];
        currentMoveText.textContent = primaryStep.name;
        statusBadgeElement.textContent = primaryStep.status === "WORK" ? "Go Time" : "Recover";
        statusBadgeElement.className = primaryStep.status === "WORK" ? "status-work" : "status-rest";
        currentIntervalText.textContent = `${Math.ceil((currentMoveIndex + 1) / 2)} / 4`;
        
        activeInterval = setInterval(processTimerTick, 1000);
        startButton.textContent = "PAUSE WORKOUT";
        startButton.classList.add("running");
    }
});

// --- MEAL COMPONENT RENDERER ---
function renderMeals(selectedDay) {
    mealsContainerElement.innerHTML = "";
    const targetedMeals = weeklyMealDatabase[selectedDay] || [];
    
    targetedMeals.forEach(mealItem => {
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

// --- MODAL EVENT HANDLERS ---
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
