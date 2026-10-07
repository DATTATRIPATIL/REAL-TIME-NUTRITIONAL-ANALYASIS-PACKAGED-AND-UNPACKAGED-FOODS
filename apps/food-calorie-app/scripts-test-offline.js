console.log("================================");
console.log("PHASE 2 OFFLINE DATASET TEST");
console.log("================================");

const fs = require("fs");

const file = "./data/foodDataset.json";

console.log("Dataset:", file);

if (!fs.existsSync(file)) {
    console.log("? Dataset file NOT FOUND");
    process.exit(1);
}

console.log("? Dataset file found");

const data = JSON.parse(
    fs.readFileSync(file, "utf8")
);

console.log("? Dataset loaded");
console.log("Records:", data.length);

const foods = ["apple", "banana", "rice", "chicken", "egg", "pizza"];

let passed = 0;

for (const name of foods) {
    const food = data.find(
        item => item.name.toLowerCase() === name.toLowerCase()
    );

    if (food) {
        console.log(
            `? ${name}: ${food.calories} kcal | Protein ${food.protein}g | Carbs ${food.carbs}g | Fat ${food.fat}g`
        );
        passed++;
    } else {
        console.log(`? ${name}: NOT FOUND`);
    }
}

console.log("--------------------------------");
console.log(`Search tests: ${passed}/${foods.length}`);
console.log(
    passed === foods.length
        ? "? OFFLINE DATASET TEST: PASS"
        : "? OFFLINE DATASET TEST: FAIL"
);
console.log("================================");
