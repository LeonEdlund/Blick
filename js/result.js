// Initialize
window.addEventListener("load", init);

async function init() {
  const id = parseInt(getId("id"));
  await getData(id);
  const isSaved = checkIfSaved(id);
  if (isSaved) changeIcon("#favorit", true);
}

// Leon - get ID
function getId(param) {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get(param);
}

// Leon - get data from SMAPI
async function getData(id) {
  const key = "KZmupnUS";
  const URL = `https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&ids=${id}`;
  const response = await fetch(URL);

  if (!response.ok) {
    console.log(`Error status: ${response.status}`);
  }

  let data = await response.json();
  if (data.header.status === `OK`) {
    data = data.payload[0];
    generateHTML(data);
    showMap(data.lat, data.lng);
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
      <button id="favorit"><img src="img/icons/heart.svg"></button>
      <div class="rating">
        <p>3/5</p>
      </div>
    </div>`;

    mainHtml =
      `<button id=toBudget>Lägg till i din budget</button>
    <h2>Information</h2>
    <p>${data.text}</p>
    `;

    document.querySelector("header").innerHTML = headerHtml;
    document.querySelector("#information").innerHTML = mainHtml;

    document.querySelector("#favorit").addEventListener("click", () => {
      favorit(data);
    });

    let toBudget = document.querySelector("#toBudget")
    toBudget.addEventListener("click", function () { resultToBudget(data) })
  }
}

// Leon - Show leaflet map
function showMap(lat, lng) {
  const zoom = 13;
  var map = L.map('map').setView([lat, lng], zoom);
  var marker = L.marker([lat, lng]).addTo(map);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

//Alexander - användaren kan lägga in en utgift driekt via result
function resultToBudget(data) {
  let category = localStorage.getItem("type");
  if (category == "food") {
    category = "food-drink"
  } else { category = "activity" }
  sessionStorage.setItem("fromResult", data.name + "&" + category)
  window.location.href = "budget.html"
}

// Jesper - Saves data in localStorage
function favorit(data) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const isSaved = checkIfSaved(data.id);

  if (!isSaved) {
    changeIcon("#favorit", true);
    wishlist.push(data);
  } else {
    changeIcon("#favorit", false);
    const index = wishlist.findIndex(item => parseInt(item.id) === parseInt(data.id));
    if (index != -1) wishlist.splice(index, 1);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function checkIfSaved(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return wishlist.some(item => parseInt(item.id) === parseInt(id));
}

function changeIcon(icon, isSaved) {
  heartIcon = document.querySelector(`${icon} img`);
  heartIcon.src = isSaved ? "img/icons/heart-active.svg" : "img/icons/heart.svg"; 
}