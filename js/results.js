// Global variables
let storedLocation; // location from localStorage
let chosenLocation; // chosen location for SMAPI
let storedCategory; // users chosen category
let usersLat; // users latitude
let usersLng; // users longitude
let resultsArray = []; // array with results from SMAPI
let pageName;

// variables for SMAPI URL
const key = "KZmupnUS"; // API-Key
let method = "method=getAll"; // vilken metod som ska användas
let type; // Types for SMAPI
let description = ""; // description
let sortBy = ""; // variable for sorting SMAPI data

// HTML-Elements
let main;
let sort; // list for sorting
let amountElem; // element for amounts of results
let list // UL element for results
let title; // Element for title on page

async function init() {
  main = document.querySelector("main");
  title = document.querySelector("#page-title");
  sort = document.querySelector("select");
  amountElem = document.querySelector("#sort p")
  list = document.querySelector("#list-of-results");

  getUserChoices()
  sort.addEventListener("change", () => {
    sessionStorage.clear();
    sortResults();
  });

  // wait for data to load and scroll to last point 
  await getData();
  
  scrollToLastPosition();
}
window.addEventListener("load", init);

// Leon - save scroll position
window.addEventListener("unload", () => {
  const scrollPosition = {
    "scrollPosition": window.scrollY,
    "fromPage": pageName,
    "sortOption": sort.selectedIndex
  };
  sessionStorage.setItem("scrollPosition", JSON.stringify(scrollPosition));
});

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
      method = "method=getFromLatLng"
      chosenLocation = `lat=${usersLat}&lng=${usersLng}`;
      break;
    case "öland":
      chosenLocation = `provinces=${storedLocation}`;
      break;
    default:
      chosenLocation = `municipalities=${storedLocation} kommun`;
  }

  // Set correct SMAPI url variable based on category
  let title = "";
  switch (storedCategory) {
    case "food":
      type = "types=food"
      title = "mat & dryck";
      changeTitle(title);
      break;
    case "nature":
      // type = "types=activity"
      description = "descriptions=älgpark,camping"
      title = "naturupplevelser";
      changeTitle(title);
      break;
    case "culture":
      type = "types=attraction"
      title = "kultur";
      changeTitle(title);
      break;
    case "activity":
      type = "types=activity";
      description = "descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      title = "aktiviteter";
      changeTitle(title);
  }
}

// Leon - get data from SMAPI
async function getData() {
  try {
    const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&${method}&${type}&${chosenLocation}&${description}&${sortBy}`);

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
  } catch (error) {
    errorMessage();
  }
}

// Leon - Prints results from SMAPI in list
function printResults(data) {
  list.innerHTML = "";

  amountElem.innerText = `Antal resultat: ${data.length} st`;
  let fragment = document.createDocumentFragment();

  resultsArray = [];
  data.forEach((result) => {

    // let newLi = document.createElement("li");
    // newLi.innerHTML = generateHTML(result);

    let newLi = generateHTML(result);
    resultsArray.push(newLi); // Save results in array

    fragment.appendChild(newLi);
  });
  list.appendChild(fragment);
}

// Leon - Generate html for results from SMAPI
function generateHTML(result) {
  let score = Math.round(result.rating);
  let priceFrom = getPrice(result.price_range);
  let lat = result.lat;
  let lng = result.lng;
  let distanceFromUser = calculateDistance(usersLat, usersLng, lat, lng);

  // create all elements
  const newLi = document.createElement("li");
  const newLink = document.createElement("a");
  const resultInfoDiv = document.createElement("div");
  const img = document.createElement("img");
  const titleElem = document.createElement("h2");
  const descriptionElem = document.createElement("p");
  const distanceElem = document.createElement("p");
  const extraInfoDiv = document.createElement("div");

  // add info to link
  newLink.href = `result.html?id=${result.id}`;
  newLink.classList.add("list-item");
  newLi.appendChild(newLink);

  // add info to result-info-div
  resultInfoDiv.classList.add("result-info");

  // add info to img
  img.src = "temporary-img/Artboard 1.svg";

  // add info to titleElem
  const title = document.createTextNode(`${result.name}`);
  titleElem.appendChild(title);

  // add info to descriptionElem
  const description = document.createTextNode(`${result.description}`);
  descriptionElem.appendChild(description);

  // add info to distanceElem
  if (usersLat && usersLng) {
    const distanceInfo = document.createTextNode(`Avstånd: ${distanceFromUser} Km`)
    distanceElem.appendChild(distanceInfo);
  }

  // add info to extraInfoDiv
  const ratingDiv = document.createElement("div");
  const rating = document.createElement("p");
  const ratingInfo = document.createTextNode(`${score}/5`);
  rating.appendChild(ratingInfo);

  const price = document.createElement("p");
  const priceInfo = document.createTextNode(`Från: ${priceFrom} Kr`);
  price.classList.add("price");
  price.appendChild(priceInfo);

  extraInfoDiv.classList.add("result-extra-info")
  ratingDiv.classList.add("rating");

  ratingDiv.appendChild(rating);
  extraInfoDiv.appendChild(ratingDiv);
  extraInfoDiv.appendChild(price);
  // add elements to resultInfoDiv
  resultInfoDiv.appendChild(titleElem);
  resultInfoDiv.appendChild(descriptionElem);
  resultInfoDiv.appendChild(distanceElem);

  // add elements to newLink
  newLink.appendChild(img);
  newLink.appendChild(resultInfoDiv);
  newLink.appendChild(extraInfoDiv);

  // add id
  newLi.setAttribute("data-distance", distanceFromUser);

  // print out elements on page
  return newLi;
}

// Leon - Change title on page
function changeTitle(category) {
  pageName = category;
  title.innerText = category;
}

// Leon - get first number of price_range
function getPrice(priceRange) {
  let index = priceRange.indexOf("-");
  if (index >= 0) {
    let price = priceRange.substring(0, index);
    return price;
  }
}

// Leon - Sort results
function sortResults() {
  switch (sort.value) {
    case "priceASC":
      sortBy = "sort_in=ASC&order_by=price_range";
      getData();
      break;
    case "priceDESC":
      sortBy = "sort_in=DESC&order_by=price_range";
      getData();
      break;
    case "ratingASC":
      sortBy = "sort_in=ASC&order_by=rating";
      getData();
      break;
    case "ratingDESC":
      sortBy = "sort_in=DESC&order_by=rating";
      getData();
      break;
    case "distanceASC":
      resultsArray.sort((a, b) => a.dataset.distance - b.dataset.distance);
      printResultsByDistance();
      break;
    case "distanceDESC":
      resultsArray.sort((a, b) => b.dataset.distance - a.dataset.distance);
      printResultsByDistance();
  }

  function printResultsByDistance() {
    list.innerHTML = "";
    let fragment = document.createDocumentFragment();
    resultsArray.forEach((result) => {
      fragment.appendChild(result);
    });
    list.appendChild(fragment);
  }
}

// Leon - Show error incase of smapi failure
function errorMessage() {
  main.innerHTML = "";
  const newHeader = document.createElement("h1");
  const newHeaderText = document.createTextNode("något gick fel!");
  newHeader.appendChild(newHeaderText);

  const newP = document.createElement("p");
  const newPText = document.createTextNode("gå tillbaka till startsidan");
  newP.appendChild(newPText);

  const newA = document.createElement("a");
  newA.href = "index.html";
  const newAText = document.createTextNode("Gå tillbaka");
  newA.appendChild(newAText);

  main.appendChild(newHeader);
  main.appendChild(newP);
  main.appendChild(newA);
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

// Leon - scroll to last position and save sorting
function scrollToLastPosition() {
  const savedPosition = JSON.parse(sessionStorage.getItem("scrollPosition"));

  if (savedPosition.fromPage == pageName) {
    sort.selectedIndex = savedPosition.sortOption;
    window.scrollTo(0, savedPosition.scrollPosition);
    sortResults();
  }
}