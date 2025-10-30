const viewdRecipeContainer = document.getElementById('viewed-recipes') ;


async function viewedRecipie() {
    const params = new URLSearchParams(window.location.search) ;
    const id = params.get('id') ;

    const respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`); 
    const data = await  respone.json() ;

    const meal = data.meals[0] ;

  
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${ingredient} - ${measure || ''}`);
      }
    } 

    viewdRecipeContainer.innerHTML = `
      <div class="viewed-recipe">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea} • ${meal.strCategory}</p>
        <p>${meal.strInstructions}</p>
        <h4>Ingredients:</h4>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    `;

    const videoId = meal.strYoutube.split('v=')[1];
      viewdRecipeContainer.innerHTML += `
        <iframe width="100%" height="315" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allowfullscreen>
        </iframe>
      `;

}

viewedRecipie() ;
