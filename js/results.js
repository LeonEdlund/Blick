// Global variables
let storedLocation; // location from localStorage
let chosenLocation; // chosen location for SMAPI
let storedCategory; // users chosen category
let usersLat; // users latitude
let usersLng; // users longitude
let resultsArray = []; // array with results from SMAPI
let pageName;

// variables for SMAPI URL
const API_CONFIG = {
  key: "KZmupnUS",
  controller: "establishment",
  method: "method=getAll",
  types: "",
  description: "",
  //sortBy: ""
}

// HTML-Elements
let sort, list;

// initializing 
window.addEventListener("load", init);
window.addEventListener("unload", saveScrollPosition);

async function init() {
  sort = document.querySelector("select");
  list = document.querySelector("#list-of-results");
  sort.addEventListener("change", sortResults);

  getUserChoices()
  changeTitle();
  await getData();
  scrollToLastPosition();
}

// Leon - Change title on page
function changeTitle() {
  const titleElem = document.querySelector("#page-title");

  const categoryTitles = {
    food: "Mat & Dryck",
    nature: "Naturupplevelser",
    culture: "Kultur",
    activity: "Aktiviteter",
  };

  const title = categoryTitles[storedCategory];
  pageName = title;
  titleElem.textContent = title;
}

// Leon - get users choices from localStorage
function getUserChoices() {
  storedCategory = localStorage.getItem("type");
  storedLocation = localStorage.getItem("location");
  usersLat = localStorage.getItem("latitude");
  usersLng = localStorage.getItem("longitude");

  // if no choices, go to index
  if (!storedCategory || !storedLocation) {
    window.location.href = "index.html";
  }

  // Set correct SMAPI url variable based on location
  switch (storedLocation) {
    case "my-position":
      API_CONFIG.method = "method=getFromLatLng"
      chosenLocation = `lat=${usersLat}&lng=${usersLng}`;
      break;
    case "öland":
      chosenLocation = `provinces=${storedLocation}`;
      break;
    default:
      chosenLocation = `municipalities=${storedLocation} kommun`;
  }

  // Set correct SMAPI url variable based on category
  switch (storedCategory) {
    case "food":
      API_CONFIG.types = "types=food"
      break;
    case "nature":
      // type = "types=activity"
      API_CONFIG.description = "descriptions=älgpark,camping,naturreservat"
      break;
    case "culture":
      API_CONFIG.types = "types=attraction"
      break;
    case "activity":
      API_CONFIG.types = "types=activity";
      API_CONFIG.description = "descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      break;
  }
}

// Leon - get data from SMAPI
async function getData() {
  const { key, controller, method, types, description, sortBy } = API_CONFIG;
  const baseURL = `https://smapi.lnu.se/api/?api_key=${key}`;
  const URLParams = `&controller=${controller}&${method}&${types}&${chosenLocation}&${description}`;
  const URL = baseURL + URLParams;
  const response = await fetch(URL);

  if (!response.ok) {
    console.log(`Error status: ${response.status}`);
  }

  const data = await response.json();
  if (data.header.status === `OK`) {
    printResults(data.payload);
  } else {
    console.log(data.header);
    errorMessage();
  }
}

// Leon - Prints results from SMAPI in list
function printResults(data) {
  const amountElem = document.querySelector("#sort p");
  list.innerHTML = "";

  amountElem.innerText = `Antal resultat: ${data.length} st`;
  let fragment = document.createDocumentFragment();

  resultsArray = [];
  data.forEach((result) => {
    let newLi = generateHTML(result);
    resultsArray.push(newLi); // Save results in array
    fragment.appendChild(newLi);
  });
  list.appendChild(fragment);
}

function printSortedResults() {
  list.innerHTML = "";
  let fragment = document.createDocumentFragment();
  resultsArray.forEach((result) => {
    fragment.appendChild(result);
  });
  list.appendChild(fragment);
}

// Leon - Generate html for results from SMAPI
function generateHTML(result) {
  let score = Math.round(result.rating);
  let priceFrom = getPrice(result.price_range);
  let lat = result.lat;
  let lng = result.lng;
  let distance = calculateDistance(usersLat, usersLng, lat, lng);

  // create all elements
  const li = document.createElement("li");
  li.innerHTML = `
  <a href="result.html?id=${result.id}" class="list-item">
    <img src="temporary-img/Artboard 1.svg" alt="">
    <div class="result-info">
      <h2>${result.name}</h2>
      <p>${result.description}</p>
      ${usersLat && usersLng ? `<p>Avstånd: ${distance} Km</p>` : ""}
    </div>
    <div class="result-extra-info">
      <div class="rating"><p>${score}/5</p></div>
        <p class="price">Från: ${priceFrom} Kr</p>
      </div>
  </a>`;

  li.setAttribute("data-distance", distance);
  li.setAttribute("data-price", priceFrom);
  li.setAttribute("data-rating", result.rating);
  return li;
}

// Leon - Sort results
function sortResults() {
  resultsArray = resultsArray.sort((a, b) => {
    const [dataA, dataB] = [a.dataset, b.dataset];
    switch (sort.value) {
      case "priceASC":
        return dataA.price - dataB.price;
      case "ratingASC":
        return dataB.rating - dataA.rating;
      case "distanceASC":
        return dataA.distance - dataB.distance;
    }
  });
  printSortedResults();
}

// Leon - get first number of price_range
function getPrice(priceRange) {
  let index = priceRange.indexOf("-");
  if (index >= 0) {
    let price = priceRange.substring(0, index);
    return price;
  }
}

// Leon - calculate distance from user *CHAT-GPT HJÄLP*
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Radius of the Earth in kilometers
  let R = 6371;

  // Convert degrees to radians
  let dLat = (lat2 - lat1) * Math.PI / 180;
  let dLon = (lon2 - lon1) * Math.PI / 180;
  // Convert latitudes to radians
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c; // Distance in kilometers
  let distanceRounded = Math.round(distance * 10) / 10
  return distanceRounded;
}

function saveScrollPosition() {
  const scrollPosition = {
    scrollPosition: window.scrollY,
    fromPage: pageName,
    sortOption: sort.selectedIndex
  };
  sessionStorage.setItem("scrollPosition", JSON.stringify(scrollPosition));
}

// Leon - scroll to last position and save sorting
function scrollToLastPosition() {
  const savedPosition = JSON.parse(sessionStorage.getItem("scrollPosition"));

  if (savedPosition.fromPage == pageName) {
    sort.selectedIndex = savedPosition.sortOption;
    window.scrollTo(0, savedPosition.scrollPosition);
    sortResults();
  }
}

// Leon - Show error incase of smapi failure
function errorMessage() {
  const main = document.querySelector("main");
  main.innerHTML = `
    <h1>Något Gick Fel</h1>
    <a href="index.html">Gå tillbaka till startsidan</a>
  `;
}