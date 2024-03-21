
const searchBar = document.getElementById('search-bar'); 
const mealsDiv = document.getElementById('meals-div'); 
const randomButton = document.getElementById('random-image'); 
const myFavoriteMeals = document.getElementById('my-favourite-meals'); 

let favouriteArray = []; 
let URL; 


if (!localStorage.getItem("favouriteArray")) {
  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favouriteArray"));
}


async function moreDetails() {
  let id = this.id;
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();

  mealsDiv.innerHTML = '';

  let meals = data.meals[0];

  const div = document.createElement('div');
  div.classList.add('details-page');
  div.innerHTML = `
    <h3>${meals.strMeal}</h3>
    <img src="${meals.strMealThumb}" alt="">
    <p>${meals.strInstructions}</p>
    <h5>Cuisine Type: ${meals.strArea}</h5>
    <a href="${meals.strYoutube}"><button type="button" class='border-circle more-details' id='${meals.idMeal}'>Watch Video</button></a>`;

  mealsDiv.append(div);
}


function toggleFavorites(event) {
  event.preventDefault();
  let index = favouriteArray.indexOf(this.id);
  if (index == -1) {
    favouriteArray.push(this.id);
    this.classList.add('clicked');
  } else {
    favouriteArray.splice(index, 1);
    this.classList.remove('clicked');
  }

  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
}


async function createMeals(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    mealsDiv.innerHTML = '';
    for (let meals of data.meals) {
      const div = document.createElement('div');
      div.classList.add('images');
      div.innerHTML = `
        <img src="${meals.strMealThumb}" alt="">
        <h4>${meals.strMeal}</h4>
        <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
        ${
          favouriteArray.includes(meals.idMeal) ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>` : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
        }`;

      mealsDiv.append(div);
    }

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  } catch (error) {
    console.log(error);
  }
}


function displaySearchResults() {
  let keyword = searchBar.value;
  URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  createMeals(URL);
}


function displayRandomImage() {
  URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
  createMeals(URL);
}


async function displayFavoriteMeals() {
  mealsDiv.innerHTML = '';

  for (let meal of favouriteArray) {
    
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    const data = await response.json();

    let meals = data.meals[0];
    

    const div = document.createElement('div');
    div.classList.add('images');
    div.innerHTML = `
      <img src="${meals.strMealThumb}" alt="">
      <h4>${meals.strMeal}</h4>
      <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
      <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

    mealsDiv.append(div);

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  }
}


searchBar.addEventListener('input', displaySearchResults); 
randomButton.addEventListener('click', displayRandomImage); 
myFavoriteMeals.addEventListener('click', displayFavoriteMeals); 
