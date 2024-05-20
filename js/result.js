import { chooseImg, errorMessage, getElement, showFeedback, savePageLink } from "/js/utils.js";
const key = "KZmupnUS";

// Initialize
window.addEventListener("load", init);

async function init() {
  const id = parseInt(getId("id"));
  if (!id) window.location = "index.html"
  await getData(id);
  const isSaved = checkIfSaved(id);
  if (isSaved) changeIcon("#favorit", true);
  savePageLink()
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
    hideFullScreenLoader()
    errorMessage(".slide-from-side");
    console.log(`Error status: ${response.status}`);
  }

  let data = await response.json();
  if (data.header.status === `OK` && data.payload.length > 0) {
    hideFullScreenLoader()
    data = data.payload[0];
    showContent(data);
    showMap(data);
    getRecommended(data.lat, data.lng);
  } else {
    hideFullScreenLoader()
    errorMessage(".slide-from-side");
    console.log(data.header);
  }
}

// Leon - Generate HTML
function showContent(data) {
  getElement("header h1").textContent = data.name;
  getElement("#header-left-side h2").textContent = data.description;
  getElement("#price-range").textContent += `${data.price_range} Kr`;
  getElement(".rating").textContent = `${Math.round(data.rating)}/5`;

  if (data.student_discount === "Y") {
    getElement("#student-discount-wrapper").style.display = "flex";
    getElement("#student-discount").textContent = "Studentrabatt";
  }

  if (data.website) {
    const websiteBtn = getElement("#website-btn");
    websiteBtn.href = data.website;
    websiteBtn.style.display = "flex";
  }

  if (data.phone_number) {
    const callBtn = getElement("#call-btn");
    callBtn.href = `tel:${data.phone_number}`;
    callBtn.style.display = "flex";
  }

  if (data.abstract.trim() || data.text.trim()) {
    getElement("#info-text-section").style.display = "block";
    getElement("#info-text").innerHTML = `
      ${data.abstract ? `<p>${data.abstract}</p>` : ""}
      ${data.text ? `<p>${formatText(data.text)}</p>` : ""}`;
  }

  document.querySelector("#favorit").addEventListener("click", () => {
    favorit(data);
  });

  let toBudget = document.querySelector("#to-budget")
  toBudget.addEventListener("click", function () { resultToBudget(data) })

  function formatText(text) {
    const paragraphs = text.split("\n");
    return paragraphs.map(paragraph => `<p>${paragraph}</p>`).join("");
  }
}

// Leon - Show leaflet map
function showMap(data) {
  const zoom = 13;
  var map = L.map('map').setView([data.lat, data.lng], zoom);
  var marker = L.marker([data.lat, data.lng]).addTo(map);
  marker.bindPopup(`${data.address}<br>${data.zip_code}, ${data.city}`);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

//Alexander - användaren kan lägga in en utgift direkt via result
function resultToBudget(data) {
  let category = localStorage.getItem("type");
  if (category == "food") {
    category = "food-drink"
  } else { category = "activity" }
  let stringData = {
    dataName: data.name,
    cat: category
  }
  sessionStorage.setItem("fromResult", JSON.stringify(stringData))
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

// Leon - returns True if object is saved in users wishlist
function checkIfSaved(id) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  return wishlist.some(item => parseInt(item.id) === parseInt(id));
}

// Leon - Change save icon if its saved or removed
function changeIcon(icon, isSaved) {
  let heartIcon = document.querySelector(`${icon} img`);
  heartIcon.src = isSaved ? "img/icons/heart-active.svg" : "img/icons/heart.svg";
}

// Leon - Hides the initial loader
function hideFullScreenLoader() {
  const loader = document.querySelector(".loader-wrapper");
  loader.classList.add("loader-hidden");
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
      description = "&descriptions=älgpark,camping,naturreservat, fornlämning"
      break;
    case "culture":
      type = "&types=attraction"
      description = "&descriptions=museum,konsthall,konstgalleri,kyrka,sevärdhet,slott";
      break;
    case "activity":
      type = "&types=activity";
      description = "&descriptions=nöjespark,temapark,älgpark,djurpark,simhall,gokart,zipline,nöjescenter,paintballcenter,hälsocenter,golfbana,bowlinghall,klippklättring,skateboardpark"
      break;
  }

  const URL = `https://smapi.lnu.se/api/?api_key=${key}&controller=establishment&method=getfromLatLng&lat=${lat}&lng=${lng}${type}${description}&radius=30&sort_in=DESC&order_by=rating&per_page=6`;
  const response = await fetch(URL);

  if (!response.ok) {
    errorMessage("swiper");
    console.log(`Error status: ${response.status}`);
  }
  const data = await response.json();

  printRecommendedResults(data.payload);
}

// Leon - Prints results from SMAPI in list
function printRecommendedResults(data) {
  const idToSkip = getId("id");
  const filteredArray = data.filter(item => item.id !== idToSkip);
  const swiperSlides = document.querySelectorAll(".swiper-slide");

  if (filteredArray.length == 0) {
    document.querySelector("#recommendations").style.display = "none";
    return;
  }

  for (let i = 0; i < swiperSlides.length && i < filteredArray.length; i++) {
    swiperSlides[i].appendChild(generateRecommendedHTML(filteredArray[i]));
  }

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
      <img src= "${img}" alt="ikon"></img>
      <h2>${result.name}</h2>
      <p>${result.description}</p>
      <img src= "${ratingImg.src}" alt="${ratingImg.alt}" id="star-rating"></img>
    </div>`;
  return link;
}

// Leon - Get star rating img based on review score
function getRatingImg(score) {
  const imgLinks = {
    1: { src: "img/icons/one-star.svg", alt: "en stjärna" },
    2: { src: "img/icons/two-stars.svg", alt: "två stjärnor" },
    3: { src: "img/icons/three-stars.svg", alt: "tre stjärnor" },
    4: { src: "img/icons/four-stars.svg", alt: "fyra stjärnor" },
    5: { src: "img/icons/five-stars.svg", alt: "fem stjärnor" }
  }

  return imgLinks[score];
}