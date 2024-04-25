const key = "KZmupnUS"; // API-Key

// variables for map
let lat;
let lng;
const zoom = 13;

// HTML-elements
let headerElem;
let mainElem;

function init() {
  let id = Number(getId("id"));
  headerElem = document.querySelector("header");
  mainElem = document.querySelector("#information");

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
    let headerHtml = "";
    let mainHtml = ""
    let svg = generateSvg();
    headerHtml =
      `<div id="header-left-side">
      <h1>${data.name}</h1>
      <h2>${data.description}</h2>
      <p>Prisklass: ${data.price_range}Kr</p>
    </div>
    <div id="header-right-side">
      <button id="favorit">${svg}</button>
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
    toBudget.addEventListener("click",function(){resultToBudget(data)} )
    

  }

  function generateSvg() {
    let svg = `
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 35.25">
        <path d="M3.86,17.7C.06,13.89.06,7.69,3.86,3.86c1.84-1.84,4.29-2.85,6.91-2.85s5.08,1.01,6.92,2.85l2.31,2.31,2.31-2.31c1.85-1.85,4.3-2.86,6.9-2.86s5.06,1.02,6.9,2.86c1.86,1.86,2.88,4.31,2.88,6.92s-1.02,5.06-2.88,6.92l-1.58,1.61-14.54,14.54L3.86,17.7Z" style="fill: #fff; stroke-width: 0px;"/>
        <path d="M29.21,2c2.34,0,4.54.91,6.2,2.57,1.67,1.67,2.59,3.87,2.59,6.21s-.92,4.54-2.6,6.22l-1.56,1.59-13.83,13.83-13.83-13.83-1.6-1.6c-3.41-3.41-3.41-8.99,0-12.42,1.65-1.65,3.86-2.56,6.21-2.56s4.56.91,6.21,2.56l1.6,1.6,1.41,1.41,1.41-1.41,1.6-1.6c1.66-1.66,3.86-2.57,6.2-2.57M29.21,0c-2.75,0-5.51,1.05-7.61,3.15l-1.6,1.6-1.6-1.6C16.29,1.04,13.55,0,10.78,0S5.27,1.04,3.15,3.15C-1.05,7.39-1.05,14.2,3.15,18.4l1.6,1.6,15.25,15.25,15.25-15.25,1.57-1.6c2.12-2.12,3.17-4.86,3.17-7.62s-1.06-5.51-3.17-7.62c-2.1-2.1-4.86-3.15-7.61-3.15h0Z" style="fill: #000; stroke-width: 0px;"/>
      </svg>`;
    return svg;
    
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

//Alexander - användaren kan lägga in en utgift driekt via result
function resultToBudget(data){
  let category = localStorage.getItem("type")
  if(category=="food"){
    category = "MatochDryck"
  }else{category="Aktiviteter"}
  sessionStorage.setItem("fromResult", data.name+"&"+category)
  window.location.href = "budget.html"
}

// Jesper
function favorit(data) {
  document.querySelector("#Layer_1 path").style.fill = "red";
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  let found = false;

  for(let i = 0; i < wishlist.length; i++){
    if(wishlist[i].id == data.id){
      found = true;
      break;
    }
  }

  if(!found){
    wishlist.push(data);
    localStorage.setItem(("wishlist"), JSON.stringify(wishlist));
  }
}