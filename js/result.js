const key = "KZmupnUS"; // API-Key

// variables for map
let lat;
let lng;
const zoom = 13;

// HTML-elements
let headerElem;
let mainElem;

// Initialize
window.addEventListener("load", init);

function init() {
  let id = Number(getId("id"));
  headerElem = document.querySelector("header");
  mainElem = document.querySelector("#information");

  getData(id);
}

// Leon - get ID
function getId(param) {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get(param);
}

// Leon - get data from SMAPI
async function getData(id) {
  const URL = `https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&ids=${id}`;
  const response = await fetch(URL);

  if (!response.ok) {
    console.log(`Error status: ${response.status}`);
  }

  let data = await response.json();
  if (data.header.status === `OK`) {
    data = data.payload[0];
    lat = data.lat;
    lng = data.lng;
    generateHTML(data);
    showMap();
  } else {
    console.log(data.header);
  }
}

// Leon - Generate HTML
function generateHTML(data) {
  if (data) {
    headerHtml =
      `<div id="header-left-side">
      <h1>${data.name}</h1>
      <h2>${data.description}</h2>
      <p>Prisklass: ${data.price_range} Kr</p>
    </div>
    <div id="header-right-side">
      <button id="favorit"><img src="img/heart.svg"></button>
      <div class="rating">
        <p>3/5</p>
      </div>
    </div>`;

    mainHtml =
      `<button id=toBudget>Lägg till i din budget</button>
    <h2>Information</h2>
    <p>${data.text}</p>
    `;

    headerElem.innerHTML = headerHtml;
    mainElem.innerHTML = mainHtml;

    document.querySelector("#favorit").addEventListener("click", () => {
      favorit(data);
    });

    let toBudget = document.querySelector("#toBudget")
    toBudget.addEventListener("click", function () { resultToBudget(data) })
  }
}

// Leon - Show leaflet map
function showMap() {
  var map = L.map('map').setView([lat, lng], zoom);
  var marker = L.marker([lat, lng]).addTo(map);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

//Alexander - användaren kan lägga in en utgift driekt via result
function resultToBudget(data) {
  let category = localStorage.getItem("type")
  if (category == "food") {
    category = "food-drink"
  } else { category = "activity" }
  sessionStorage.setItem("fromResult", data.name + "&" + category)
  window.location.href = "budget.html"
}

// Jesper
function favorit(data) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  let found = false;

  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id == data.id) {
      found = true;
      break;
    }
  }

  if (!found) {
    wishlist.push(data);
    localStorage.setItem(("wishlist"), JSON.stringify(wishlist));
  }
}