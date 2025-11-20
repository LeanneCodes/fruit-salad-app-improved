const form = document.getElementById('fruitForm');
const input = document.getElementById('fruitInput');
const list = document.getElementById('fruitList');
const totalCalsDisplay = document.getElementById('totalCals');

let totalCalories = 0;

// Update calorie display
function updateCalories() {
    totalCalsDisplay.textContent = totalCalories;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fruit = input.value.trim().toLowerCase();
    if (!fruit) return;

    try {
        // Fetch nutrition data
        const nutriRes = await fetch(`https://fruit-api-5v0j.onrender.com/fruits/${fruit}`);
        if (!nutriRes.ok) {
            alert("Fruit not found!");
            return;
        }
        const nutriData = await nutriRes.json();
        const calories = nutriData.nutritions.calories;

        // Fetch photo (Unsplash source)
        const imgUrl = await fetch(`https://pixabay.com/api/?key=53335798-a1f7690b1069558f17b0c78a0&q=${fruit}`);
        if (!imgUrl.ok) {
            alert("Fruit image not found!");
            return;
        }
        const imgData = await imgUrl.json();
        const fruitImg = imgData.hits[0].previewURL;

        // Create list item
        const li = document.createElement('li');
        li.classList.add('fruit-item');

        // Save calories on the element
        li.dataset.calories = calories;

        li.innerHTML = `
            <strong>${fruit}</strong><br>
            <img src="${fruitImg}" alt="${fruit}">
            <p>${calories} calories</p>
        `;

        // Add click-to-remove behaviour
        li.addEventListener('click', () => {
            totalCalories -= Number(li.dataset.calories);
            updateCalories();
            li.remove();
        });

        // Append to list
        list.appendChild(li);

        // Update total calories
        totalCalories += calories;
        updateCalories();

        // Clear input
        input.value = '';

    } catch (error) {
        console.error(error);
        alert("Something went wrong fetching data");
    }
});
