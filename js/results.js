const key = "KZmupnUS"; // API-Key
let storedLocation; // location from localStorage
let chosenLocation; // chosen location for SMAPI
let usersLat;
let usersLng;
let chosenType; // chosen category for SMAPI
let type;
let method = "method=getAll"; // vilken metod som ska användas
let description = "";

function init() {
  type = localStorage.getItem("type");
  storedLocation = localStorage.getItem("location");
  usersLat = localStorage.getItem("latitude");
  usersLng = localStorage.getItem("longitude");

  // get location from local storage
  switch (storedLocation) {
    case "my-position":
      method = "method=getFromLatLng"
      chosenLocation = `lat=${usersLat}&lng=${usersLng}`;
      break;
    case "öland":
      chosenLocation = "provinces=" + localStorage.getItem("location");
      break;
    default:
      chosenLocation = "cities=" + localStorage.getItem("location");
  }

  console.log(storedLocation);

  switch (type) {
    case "food":
      type = "types=food"
      changeTitle("mat & dryck");
      break;
    case "nature":
      type = "types=activity"
      changeTitle("naturupplevelser");
      break;
    case "culture":
      type = "types=attraction"
      changeTitle("kultur");
      break;
    case "activity":
      type = "types=activity";
      description = "descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      changeTitle("aktiviteter");
  }

  // get data when page loads
  getData();
}
window.addEventListener("load", init);

// change title on page
function changeTitle(category) {
  let title = document.querySelector("#page-title");
  title.innerText = category;
}

// get data from SMAPI
async function getData() {
  const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&${method}&${type}&${chosenLocation}&${description}`);
  const data = await response.json();
  if (data.header.status === `OK`) {
    //console.log(data.payload);
    printResults(data.payload);
  } else {
    console.log(data.header);
  }
}

// Prints results from SMAPI in list
function printResults(data) {
  const amount = document.querySelector("#sort p");
  amount.innerText = `Antal resultat: ${data.length}`;
  const list = document.querySelector("#list-of-results");
  list.innerHTML = "";

  data.forEach((result) => {
    let score = result.rating.substring(0,3);
    let priceFrom = getPrice(result.price_range);

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
    newLink.href = "#"
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

    // add info to extraInfoDiv
    const ratingDiv = document.createElement("div");
    const rating = document.createElement("p");
    const ratingInfo = document.createTextNode(`${score}/5`);
    rating.appendChild(ratingInfo);

    const price = document.createElement("p");
    const priceInfo = document.createTextNode(`Pris från: ${priceFrom} Kr`);
    price.appendChild(priceInfo);

    extraInfoDiv.classList.add("result-extra-info")
    ratingDiv.classList.add("rating");

    ratingDiv.appendChild(rating);
    extraInfoDiv.appendChild(ratingDiv);
    extraInfoDiv.appendChild(price);

    // add info to rating
    //const 

    // add elements to resultInfoDiv
    resultInfoDiv.appendChild(titleElem);
    resultInfoDiv.appendChild(descriptionElem);

    // add elements to newLink
    newLink.appendChild(img);
    newLink.appendChild(resultInfoDiv);
    newLink.appendChild(extraInfoDiv);

    // print out elements on page
    list.appendChild(newLi);
  });
}

function getPrice(priceRange) {
  let index = priceRange.indexOf("-");
  if(index >= 0){
    let price = priceRange.substring(0,index);
    return price;
  } 
}