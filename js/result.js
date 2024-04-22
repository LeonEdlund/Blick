const key = "KZmupnUS"; // API-Key

// variables for map
let lat;
let lng;
const zoom = 13;

// HTML-elements
let headerElem;
let mainElem;
let goBackBtn;

function init() {
  let id = Number(getId("id"));
  headerElem = document.querySelector("header");
  mainElem = document.querySelector("#information");
  goBackBtn = document.querySelector("#go-back");

  goBackBtn.addEventListener("click", () => {
    window.location.href = "results.html"
  })

  getData(id);
}
window.addEventListener("load", init);

// Leon - get ID
function getId(param) {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get(param);
}

// Leon - get data from SMAPI
async function getData(id) {
  const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&ids=${id}`);
  if (!response.ok) {
    console.log(`HTTP error! status: ${response.status}`);
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
    let headerHtml = "";
    let mainHtml = ""

    headerHtml =
    `<div id="header-left-side">
      <h1>${data.name}</h1>
      <h2>${data.description}</h2>
      <p>Prisklass: ${data.price_range}Kr</p>
    </div>
    <div id="header-right-side">
      <img src="" alt="">
      <div class="rating">
        <p>3/5</p>
      </div>
    </div>`;

    mainHtml =
    `<h2>Information</h2>
    <p>${data.text}</p><button id=toBudget>Lägg till i din budget</button>`;

    headerElem.innerHTML = headerHtml; 
    mainElem.innerHTML = mainHtml;
    resultToBudget(data)
  }
}


// Leon - Show leaflet map
function showMap() {
  let usersLat = localStorage.getItem("latitude");
  let usersLng = localStorage.getItem("longitude");

  var map = L.map('map').setView([lat, lng], zoom);
  var marker = L.marker([lat, lng]).addTo(map);
  // var userLocationMarker = L.marker([usersLat, usersLng]).addTo(map);
  // userLocationMarker.bindPopup("<b>Din Position");

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function resultToBudget(data){
  let toBudget = document.querySelector("#toBudget")
  toBudget.innerHTML = "<a href='budget/budget.html'>Lägg till i din budget</a>" 
  let now = new Date()
  now.setTime(now.getTime() + (1*60*1000))
  document.cookie="fromResult="+data.name+";expires="+now
  console.log(document.cookie)

}