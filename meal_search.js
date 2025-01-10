document.getElementById('searchButton').addEventListener('click', searchMeals);

let fullResults = [];
let showAllVisible = false;

async function searchMeals() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsSection = document.getElementById('mealResults');
    resultsSection.innerHTML = ''; // Clear previous results
    showAllVisible = false;

    if (!query) {
        alert('Please enter a search term!');
        return;
    }

    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.meals) {
            resultsSection.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger fw-bold">No meals found. Try a different search.</p>
                </div>
            `;
            return;
        }

        fullResults = data.meals;
        displayMeals(fullResults.slice(0, 5));

        if (fullResults.length > 5) {
            addShowAllButton();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        resultsSection.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger fw-bold">Something went wrong. Please try again later.</p>
            </div>
        `;
    }
}

function displayMeals(meals) {
    const resultsSection = document.getElementById('mealResults');
    meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'col-md-4 col-sm-6';

        card.innerHTML = `
            <div class="card meal-card">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal} (ID: ${meal.idMeal})</h5>
                    <p class="card-text text-truncate" style="max-height: 3.5rem;">${meal.strInstructions}</p>
                </div>
            </div>
        `;

        resultsSection.appendChild(card);
    });
}

function addShowAllButton() {
    const resultsSection = document.getElementById('mealResults');
    const button = document.createElement('div');
    button.className = 'col-12 text-center mt-3';
    button.innerHTML = `
        <button class="btn btn-secondary">SHOW ALL</button>
    `;
    button.querySelector('button').addEventListener('click', () => {
        if (!showAllVisible) {
            displayMeals(fullResults.slice(5));
            showAllVisible = true;
            button.style.display = 'none';
        }
    });

    resultsSection.appendChild(button);
}
