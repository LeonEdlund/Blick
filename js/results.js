import { chooseImg, errorMessage, savePageLink, getElement, hideLoader } from "/js/utils.js"

const USER_CHOICES = {
  location: JSON.parse(localStorage.getItem("location")),
  category: localStorage.getItem("type"),
  lat: localStorage.getItem("latitude"),
  lng: localStorage.getItem("longitude")
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

let pageName = "";
let list;
let sort;

// initializing 
window.addEventListener("load", init);
window.addEventListener("pagehide", saveScrollPosition);

async function init() {
  if (!USER_CHOICES.category || !USER_CHOICES.location) {
    window.location.href = "index.html";
  }

  sort = document.querySelector("select");
  list = document.querySelector("#list-of-results");

  sort.addEventListener("change", sortResults);
  
  savePageLink();
  changeTitle();
  setURLParams();
  checkSortOptions();
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
  pageName = title;
  titleElem.textContent = title;
}

// Leon - Set url parameters for smapi based on users choices
function setURLParams() {
  const { location, category, lat, lng, } = USER_CHOICES;

  if (location.type == "search") {
    API_PARAMS.location = location.param;
  } else {
    switch (location.param) {
      case "my-position":
        API_PARAMS.method = "method=getFromLatLng"
        API_PARAMS.location = `&lat=${lat}&lng=${lng}`;
        break;
      case "öland":
        API_PARAMS.location = `provinces=${location.param}`;
        break;
      default:
        API_PARAMS.location = `municipalities=${location.param} kommun`;
        break;
    }
  }

  switch (category) {
    case "food":
      API_PARAMS.types = "types=food"
      break;
    case "nature":
      API_PARAMS.description = "descriptions=älgpark,camping,naturreservat,fornlämning"
      break;
    case "culture":
      API_PARAMS.types = "types=attraction"
      API_PARAMS.description = "descriptions=museum,konsthall,konstgalleri,kyrka,sevärdhet,slott";
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

  
  const response = await fetch(URL);
  if (!response.ok) {
    hideLoader(".loader");
    errorMessage("main");
    console.log(`Error status: ${response.status}`);
  }
  
  const data = await response.json();
  if (data.header.status === `OK`) {
    hideLoader(".loader");
    printResults(data.payload);
  } else {
    hideLoader(".loader");
    errorMessage("main");
    console.log(data.header);
  }
}

// Leon - Prints results from SMAPI in list
function printResults(data) {
  const amountElem = document.querySelector("#sort p");

  list.innerHTML = "";
  amountElem.innerText = `Antal resultat: ${data.length} st`;

  const fragment = document.createDocumentFragment();

  data.forEach((result) => {
    let newLi = generateHTML(result);
    fragment.appendChild(newLi);
  });

  list.appendChild(fragment);
}

// Leon - Generate html for results from SMAPI
function generateHTML(result) {
  const score = Math.round(result.rating);
  const priceFrom = getPrice(result.price_range);
  const img = chooseImg(result.description);
  const isDistanceAvailable = API_PARAMS.method === 'method=getFromLatLng';

  const li = document.createElement("li");
  li.innerHTML = `
  <a href="result.html?id=${result.id}" class="list-item">
    <img src="${img}" alt="">
    <div class="result-info">
      <h2>${result.name}</h2>
      <p>${result.description}</p>
      ${isDistanceAvailable ? `<p>Avstånd: ${Math.round(result.distance_in_km * 10) / 10} Km</p>` : ""}
    </div>
    <div class="result-extra-info">
      <div class="rating"><p>${score}/5</p></div>
        <p class="price">Från: ${priceFrom} Kr</p>
      </div>
  </a>`;

  return li;
}

// Leon - Sort results
async function sortResults() {
  const sortOptions = {
    priceASC: "sort_in=ASC&order_by=price_range",
    priceDESC: "sort_in=DESC&order_by=price_range",
    ratingDESC: "sort_in=DESC&order_by=rating",
    distanceASC: "sort_in=ASC&order_by=distance_in_km"
  }

  API_PARAMS.sortBy = sortOptions[sort.value]
  await getData();
  return;
}

// Leon - get first number of price_range
function getPrice(priceRange) {
  let index = priceRange.indexOf("-");
  if (index >= 0) {
    let price = priceRange.substring(0, index);
    return price;
  }
}

// Leon - Cut of second word in sorting option and sort by distance option if user location is chosen
function checkSortOptions() {
  if (API_PARAMS.method == `method=getFromLatLng`) {
    const option = document.createElement("option");
    option.value = "distanceASC";
    option.textContent = "Närmast"
    sort.appendChild(option);
  }
}

// Leon - save the scroll position too local storage
function saveScrollPosition() {
  const scrollPosition = {
    scrollPosition: window.scrollY,
    fromPage: pageName,
    sortOption: sort.selectedIndex
  };
  sessionStorage.setItem("scrollPosition", JSON.stringify(scrollPosition));
}

// Leon - scroll to last position and change sorting option
async function scrollToLastPosition() {
  const savedPosition = JSON.parse(sessionStorage.getItem("scrollPosition"));

  if (savedPosition && savedPosition.fromPage == pageName) {
    sort.selectedIndex = savedPosition.sortOption;
    await sortResults();
    window.scrollTo(0, savedPosition.scrollPosition);
  }
}