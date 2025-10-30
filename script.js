const recipeInput = document.getElementById('recipe-input');
const recipeContainer = document.getElementById('recipes');
const searchButton = document.getElementById('search-btn');

recipeContainer.addEventListener('click', (e) => {
  if(e.target.classList.contains('view-recipe')) {
    const id = e.target.dataset.id ;
     window.location.href = `viewRecipie.html?id=${id}`;
  }
}) ;

async function loadRandomRecipe(count = 12 , append = false) {
  if (!append && recipeContainer.innerHTML.trim() === '') {
    recipeContainer.innerHTML = '<p>Loading recipes...</p>';
  }

  const requests = [];

  for (let i = 0; i < count; i++) {
    requests.push(fetch('https://www.themealdb.com/api/json/v1/1/random.php'));
  }

  const responses = await Promise.all(requests);
  const dataPromises = responses.map(res => res.json());
  const dataArray = await Promise.all(dataPromises);

  let recipeHtml = '';

  dataArray.forEach((data) => {
    const meal = data.meals[0];
    recipeHtml += `
       <div class="recipe">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea} • ${meal.strCategory}</p>
        <button class="view-recipe" data-id="${meal.idMeal}">View</button>
      </div>
    `;
  });

  if(append) {
      recipeContainer.innerHTML += recipeHtml;
  } else {
    recipeContainer.innerHTML = recipeHtml ;
  }
}

let isLoading = false ;
window.addEventListener('scroll' , () => {
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    isLoading = true ;
    loadRandomRecipe(12, true).then(() => {
      isLoading = false
    })
  }
})

searchButton.addEventListener('click', () => {
  const name = recipeInput.value.trim();
  if (name) {
    searchRecipes(name);
  }
});

let timeoutID;
recipeInput.addEventListener('input', () => {
  const name = recipeInput.value.trim();
  clearTimeout(timeoutID);

  if (!name) {
    recipeContainer.innerHTML = '<p>Please enter a recipe name.</p>';
    return;
  }

  timeoutID = setTimeout(() => searchRecipes(name), 500);
});

async function searchRecipes(name) {
  recipeContainer.innerHTML = '<p>Searching...</p>';
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();

    if (!data.meals) {
      recipeContainer.innerHTML = '<p>No recipes found.</p>';
      return;
    }

    recipeContainer.innerHTML = data.meals.map(recipe =>
      `
      <div class="recipe">
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>${recipe.strMeal}</h3>
        <p>${recipe.strArea} • ${recipe.strCategory}</p>
        <button class="view-recipe" data-id="${recipe.idMeal}">View</button>
      </div>`
    ).join('');

  } catch (error) {
    recipeContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
}

loadRandomRecipe();


    