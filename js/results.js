const USER_CHOICES = {
  location: localStorage.getItem("location"),
  category: localStorage.getItem("type"),
  lat: localStorage.getItem("latitude"),
  lng: localStorage.getItem("longitude")
}

const DOM_ELEMENTS = {
  sort: document.querySelector("select"),
  list: document.querySelector("#list-of-results")
}

let API_PARAMS = {
  key: "KZmupnUS",
  controller: "establishment",
  method: "method=getAll",
  location: "",
  types: "",
  description: "",
  sortBy: ""
}

let APP_DATA = {
  results: [],
  pageName: ""
}

// initializing 
window.addEventListener("load", init);
window.addEventListener("unload", saveScrollPosition);

async function init() {
  if (!USER_CHOICES.category || !USER_CHOICES.location) {
    window.location.href = "index.html";
  }
  
  DOM_ELEMENTS.sort.addEventListener("change", sortResults);

  changeTitle();
  setURLParams();
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

  const title = categoryTitles[USER_CHOICES.category];
  APP_DATA.pageName = title;
  titleElem.textContent = title;
}

function setURLParams() {
  const { location, category, lat, lng, } = USER_CHOICES;
  switch (location) {
    case "my-position":
      API_PARAMS.method = "method=getFromLatLng"
      API_PARAMS.location = `lat=${lat}&lng=${lng}`;
      break;
    case "öland":
      API_PARAMS.location = `provinces=${location}`;
      break;
    default:
      API_PARAMS.location = `municipalities=${location} kommun`;
      break;
  }

  switch (category) {
    case "food":
      API_PARAMS.types = "types=food"
      break;
    case "nature":
      API_PARAMS.description = "descriptions=älgpark,camping,naturreservat"
      break;
    case "culture":
      API_PARAMS.types = "types=attraction"
      break;
    case "activity":
      API_PARAMS.types = "types=activity";
      API_PARAMS.description = "descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      break;
  }
}

// Leon - get data from SMAPI
async function getData() {
  const { key, controller, method, location, types, description, sortBy } = API_PARAMS;
  const baseURL = `https://smapi.lnu.se/api/?api_key=${key}`;
  const URLParams = `&controller=${controller}&${method}&${types}&${location}&${description}&${sortBy}`;
  const URL = baseURL + URLParams;

  showLoader(DOM_ELEMENTS.list);
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
  const { list } = DOM_ELEMENTS;
  let { results } = APP_DATA;

  list.innerHTML = "";
  const amountElem = document.querySelector("#sort p");
  amountElem.innerText = `Antal resultat: ${data.length} st`;

  const fragment = document.createDocumentFragment();
  
  results.length = 0;
  data.forEach((result) => {
    let newLi = generateHTML(result);
    results.push(newLi); // Save results in array
    fragment.appendChild(newLi);
  });
  console.log(results);
  list.appendChild(fragment);
}

// Print out the results from sorted array 
function printSortedResults() {
  const { list } = DOM_ELEMENTS;
  list.innerHTML = "";
  let fragment = document.createDocumentFragment();
  APP_DATA.results.forEach((result) => {
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
  let distance = calculateDistance(USER_CHOICES.lat, USER_CHOICES.lng, lat, lng);

  // create all elements
  const li = document.createElement("li");
  li.innerHTML = `
  <a href="result.html?id=${result.id}" class="list-item">
    <img src="temporary-img/Artboard 1.svg" alt="">
    <div class="result-info">
      <h2>${result.name}</h2>
      <p>${result.description}</p>
      ${USER_CHOICES.lat && USER_CHOICES.lng ? `<p>Avstånd: ${distance} Km</p>` : ""}
    </div>
    <div class="result-extra-info">
      <div class="rating"><p>${score}/5</p></div>
        <p class="price">Från: ${priceFrom} Kr</p>
      </div>
  </a>`;

  li.setAttribute("data-distance", distance);
  return li;
}

// Leon - Sort results
function sortResults() {
  console.log(APP_DATA.results)
  switch (DOM_ELEMENTS.sort.value) {
    case "priceASC":
      API_PARAMS.sortBy = "sort_in=ASC&order_by=price_range";
      getData();
      break;
    case "ratingDESC":
      API_PARAMS.sortBy = "sort_in=DESC&order_by=rating";
      getData();
      break;
    case "distanceASC":
      APP_DATA.results.sort((a, b) => a.dataset.distance - b.dataset.distance);
      console.log(APP_DATA.results)
      printSortedResults();
      break;
  }
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
    fromPage: APP_DATA.pageName,
    sortOption: DOM_ELEMENTS.sort.selectedIndex
  };
  sessionStorage.setItem("scrollPosition", JSON.stringify(scrollPosition));
}

// Leon - scroll to last position and save sorting
function scrollToLastPosition() {
  const savedPosition = JSON.parse(sessionStorage.getItem("scrollPosition"));

  if (savedPosition.fromPage == APP_DATA.pageName) {
    DOM_ELEMENTS.sort.selectedIndex = savedPosition.sortOption;
    window.scrollTo(0, savedPosition.scrollPosition);
    sortResults();
  }
}

// Leon - adds a loader to the given element
function showLoader(element) {
  element.innerHTML = `<div class="loader"></div>`;
}

// Leon - Show error incase of smapi failure
function errorMessage() {
  const main = document.querySelector("main");
  main.innerHTML = `
    <h1>Något Gick Fel</h1>
    <a href="index.html">Gå tillbaka till startsidan</a>
  `;
}