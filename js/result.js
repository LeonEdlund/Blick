const key = "KZmupnUS";
// Initialize
window.addEventListener("load", init);

async function init() {
  const id = parseInt(getId("id"));
  if(!id) window.location = "index.html"

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
  const URL = `https://smapi.lnu.se/api/?api_key=${key}&controller=establishment&method=getAll&ids=${id}`;
  const response = await fetch(URL);

  if (!response.ok) {
    console.log(`Error status: ${response.status}`);
  }

  let data = await response.json();
  if (data.header.status === `OK`) {
    data = data.payload[0];
    generateHTML(data);
    showMap(data.lat, data.lng);
    getRecommended(data.lat, data.lng);
  } else {
    console.log("hej")
    errorMessage(".slide-from-side");
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
      <div id="contact">
      ${data.website ? `<a href="${data.website}" target="_blank">Hemsida</a>` : ""}
      ${data.phone_number ? `<a href="tel:${data.phone_number}">Ring</a>` : ""}
    </div>
    </div>
    <div id="header-right-side">
      <button id="favorit"><img src="img/icons/heart.svg"></button>
      <div class="rating">
        <p>3/5</p>
      </div>
    </div>`;

    const information = data.text ? `<h2>Information</h2><p>${data.text}</p>` : "";
    mainHtml =
      `
    <button id=toBudget>Lägg till i din budget</button>
    ${information}

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
    showFeedback()
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

/*CODE FOR RECOMMENDATIONS*/
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.5,
  spaceBetween: 30,
  freeMode: true
});

async function getRecommended(lat, lng) {
  const category = localStorage.getItem("type");
  let type = "";
  let description = "";
  switch (category) {
    case "food":
      type = "&types=food"
      break;
    case "nature":
      description = "&descriptions=älgpark,camping,naturreservat"
      break;
    case "culture":
      type = "&types=attraction"
      break;
    case "activity":
      type = "&types=activity";
      description = "&descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      break;
  }

  const URL = `https://smapi.lnu.se/api/?api_key=${key}&controller=establishment&method=getfromLatLng&lat=${lat}&lng=${lng}${type}${description}&sort_in=DESC&order_by=rating&per_page=6`;
  const response = await fetch(URL);

  if (!response.ok) {
    console.log(`Error status: ${response.status}`);
  }
  const data = await response.json();

  printRecommendedResults(data.payload);
}

// Leon - Prints results from SMAPI in list
function printRecommendedResults(data) {
  const idToSkip = getId("id");
  const filteredArray = data.filter(item => item.id !== idToSkip);

  if (filteredArray.length == 0) {
    document.querySelector("#recommendations").style.display = "none";
    return;
  }
  console.log(filteredArray)

  const swiperSlides = document.querySelectorAll(".swiper-slide");

  for (let i = 0; i < swiperSlides.length && i < filteredArray.length; i++) {
    swiperSlides[i].appendChild(generateRecommendedHTML(filteredArray[i]));
  }

  // removes slides not used
  for (let i = data.length; i < swiperSlides.length; i++) {
    swiperSlides[i].style.display = 'none';
  }
}

// Leon - Generate html for results from SMAPI
function generateRecommendedHTML(result) {
  const score = Math.round(result.rating);
  const ratingImg = getRatingImg(score);
  const img = chooseImg(result.description);

  const link = document.createElement("a");
  link.href = `result.html?id=${result.id}`
  link.classList.add("recommended");
  link.innerHTML = `
    <div>
      <img src= "${img}" alt=""></img>
      <h2>${result.name}</h2>
      <p>${result.description}</p>
      <img src= "${ratingImg.src}" alt="${ratingImg.alt}" id="star-rating"></img>
    </div>`;
  return link;
}

function getRatingImg(score) {
  imgLinks = {
    2: { src: "img/icons/two-stars.svg", alt: "två stjärnor" },
    3: { src: "img/icons/three-stars.svg", alt: "tre stjärnor" },
    4: { src: "img/icons/four-stars.svg", alt: "fyra stjärnor" },
    5: { src: "img/icons/five-stars.svg", alt: "fem stjärnor" }
  }

  return imgLinks[score];
}