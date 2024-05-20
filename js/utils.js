// Leon - choose image based on description from SMAPI 
export function chooseImg(description) {
  description = description.toLowerCase()

  let descriptions = {
    // Food
    pizzeria: "img/icons/results/pizza.svg",
    cafe: "img/icons/results/cafe.svg",
    hamburgerkedja: "img/icons/results/hamburger.svg",
    gatukök: "img/icons/results/hamburger.svg",

    // Nature
    camping: "img/icons/results/camping.svg",

    // culture
    museum: "img/icons/results/museum.svg",
    konsthall: "img/icons/results/art.svg",
    konstgalleri: "img/icons/results/art.svg",
    kyrka: "img/icons/results/church.svg",
    slott: "img/icons/results/castle.svg",

    // Activities
    golfbana: "img/icons/results/golf.svg",
    simhall: "img/icons/results/swimming.svg",
    bowlinghall: "img/icons/results/bowling.svg",
    skateboardpark: "img/icons/results/skate.svg"
  }

  if (descriptions[description]) {
    return descriptions[description];
  }

  let types = {
    food: "img/food.svg",
    nature: "img/nature.svg",
    activity: "img/activities.svg",
    culture: "img/culture.svg"
  }

  return types[localStorage.getItem("type")];
}

// Leon - Show error message
export function errorMessage(element) {
  document.querySelector(element).innerHTML = `
  <div id="error">
    <h1>Något Gick Fel</h1>
    <a href="index.html">Gå tillbaka till startsidan</a>
  </div>
  `;
}

// Leon - fat way to get DOMelement 
export function getElement(elem) {
  return document.querySelector(elem);
}

// Leon - Show and remove element with class .feedback
export function showFeedback() {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.style.display = "flex";
  setTimeout(() => {
    feedbackDiv.style.opacity = "1";
    feedbackDiv.style.transform = "translateX(-50%) translateY(20%)"
  }, 10);

  setTimeout(() => {
    feedbackDiv.style.opacity = "0";
    feedbackDiv.style.transform = "translateX(-50%) translateY(-100%)"
  }, 2000);
  setTimeout(() => { feedbackDiv.style.display = "none" }, 3000);
}

// Leon - save users location
export function savePageLink() {
  let location = window.location.pathname.substring(1);
  localStorage.setItem("lastLocation", location);
  console.log(window.location.search)
  if (window.location.search) {
    let locationId = window.location.search;
    localStorage.setItem("lastLocationId", locationId);
  }
}

// Leon - Change href for "explore btn"
export function changeExploreBtn() {
  let storedLocation = localStorage.getItem("lastLocation");
  let storedLocationId = localStorage.getItem("lastLocationId");
  console.log(storedLocation);
  if (storedLocation) {
    document.querySelector(".explore-btn").href = storedLocation;
  };

  if (storedLocationId) {
    document.querySelector(".explore-btn").href += storedLocationId;
  }
}