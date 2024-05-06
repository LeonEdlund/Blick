var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    width: 200,
    freeMode: true,
    pagination: {
        clickable: true,
    },
});

const USER_CHOICES = {
    location: localStorage.getItem("location"),
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

let APP_DATA = {
    results: [],
}

window.addEventListener("load", init);

async function init() {
    setURLParams();
    await getData();
}

function setURLParams() {
    const { location, lat, lng, } = USER_CHOICES;
    API_PARAMS.types = `types=${category}`;
    console.log(category)

    switch (location) {
        case "my-position":
            API_PARAMS.method = "method=getFromLatLng"
            API_PARAMS.location = `&lat=${lat}&lng=${lng}`;
            break;
        case "öland":
            API_PARAMS.location = `provinces=${location}`;
            break;
        case "gränna":
        case "visingsö":
            API_PARAMS.location = `cities=${location}`;
            break;
        default:
            API_PARAMS.location = `municipalities=${location} kommun`;
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

    console.log(URL)

    if (!response.ok) {
        console.log(`Error status: ${response.status}`);
    }

    const data = await response.json();
    printResults(data.payload);

}

// Leon - Prints results from SMAPI in list
function printResults(data) {
    let { results } = APP_DATA;

    console.log(data);

    const swiperWrapper = document.querySelector(".swiper-wrapper");

    results.length = 0;
    data.forEach((result) => {
        let newLi = generateHTML(result);
        results.push(newLi); // Save results in array
        swiperWrapper.appendChild(newLi);
    });
}

// Leon - Generate html for results from SMAPI
function generateHTML(result) {
    const score = Math.round(result.rating);
    const priceFrom = getPrice(result.price_range);
    const img = chooseImg(result.description);
    // create all elements
    const div = document.createElement("div");
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="result.html?id=${result.id}" class="list-item">
      <img src="${img}" alt="">
      <div class="result-info">
        <h2>${result.name}</h2>
        <p>${result.description}</p>
        ${API_PARAMS.method === "method=getFromLatLng" ? `<p>Avstånd: ${Math.round(result.distance_in_km * 10) / 10} Km</p>` : ""}
      </div>
      <div class="result-extra-info">
        <div class="rating"><p>${score}/5</p></div>
          <p class="price">Från: ${priceFrom} Kr</p>
        </div>
    </a>`;
    return div;
}

function getPrice(priceRange) {
    let index = priceRange.indexOf("-");
    if (index >= 0) {
        let price = priceRange.substring(0, index);
        return price;
    }
}
