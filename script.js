const recipeInput = document.getElementById('recipe-input');
const recipesContainer = document.getElementById('recipes');

let isLoading = false;

async function loadRandomRecipes(count = 10) {
  if (recipesContainer.innerHTML.trim() === '') {
    recipesContainer.innerHTML = '<p>Loading recipes...</p>';
  }

  let recipeHtml = '';
  isLoading = true;

  for (let i = 0; i < count; i++) {
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await res.json();
    const meal = data.meals[0];

    recipeHtml += `
      <div class="recipe">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea} • ${meal.strCategory}</p>
      </div>
    `;
  }

  recipesContainer.innerHTML = recipeHtml; 
  isLoading = false;
}


window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    loadRandomRecipes(10);
  }
});

let timeoutId;
recipeInput.addEventListener('input', () => {
  const title = recipeInput.value.trim();
  clearTimeout(timeoutId);

  
  if (!title) {
    recipesContainer.innerHTML = '';
    loadRandomRecipes(); // reload random recipes
    return;
}


  timeoutId = setTimeout(() => searchRecipe(title), 500);
});

async function searchRecipe(title) {
  recipesContainer.innerHTML = '<p>Searching...</p>';
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${title}`);
    const data = await response.json();

    if (!data.meals) {
      recipesContainer.innerHTML = '<p>No recipe found</p>';
      return;
    }

    recipesContainer.innerHTML = data.meals
      .map(
        food => `
        <div class="recipe">
          <img src="${food.strMealThumb}" alt="${food.strMeal}">
          <h3>${food.strMeal}</h3>
          <p>${food.strArea} • ${food.strCategory}</p>
        </div>`
      )
      .join('');
  } catch (error) {
    recipesContainer.innerHTML = '<p>Something went wrong, please try again later</p>';
  }
}

loadRandomRecipes();


// logo 
      const logo = document.getElementById("logo");
      function adjustTitle() {
        logo.textContent = window.innerWidth <= 600 ? "🍽️ RAP" : "🍽️ Recipe App Finder";
      }
      adjustTitle();
      window.addEventListener("resize", adjustTitle);