function showFeedback() {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.style.display = "block";
  setTimeout(() => {
    feedbackDiv.style.opacity = "1";
    feedbackDiv.style.transform = "translateX(-50%) translateY(20%)"

  }, 10);

  setTimeout(() => {
    feedbackDiv.style.opacity = "0";
    feedbackDiv.style.transform = "translateX(-50%) translateY(-100%)"
  }, 2000);
}

function chooseImg(description) {
  description = description.toLowerCase()
  console.log(description)
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

// Leon - Show error incase of smapi failure
function errorMessage(element) {
  document.querySelector(element).innerHTML = `
  <h1>Något Gick Fel</h1>
  <a href="index.html">Gå tillbaka till startsidan</a>
  `;
}