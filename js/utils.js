function showFeedback() {
  const feedbackDiv = document.querySelector(".feedback");
  feedbackDiv.style.display = "block";
  setTimeout(() => {
    feedbackDiv.style.opacity = "1";
    feedbackDiv.style.transform = "translateX(-50%) translateY(50%)"

  }, 10);

  setTimeout(() => {
    feedbackDiv.style.opacity = "0";
    feedbackDiv.style.transform = "translateX(-50%) translateY(-100%)"

  }, 2000);

}

function chooseImg(description) {
  description = description.toLowerCase()
  
  let descriptions = {
    // Food
    pizzeria: "img/icons/temp-icons/pizza.svg",
    cafe: "img/icons/temp-icons/cafe.svg",
    hamburgerkedja: "img/icons/temp-icons/hamburger.svg",
    gatukök: "img/icons/temp-icons/hamburger.svg",

    // Nature
    camping: "img/icons/temp-icons/camping.svg",

    // culture
    museum: "img/icons/temp-icons/museum.svg",
    konsthall: "img/icons/temp-icons/art.svg",
    konstgalleri: "img/icons/temp-icons/art.svg",
    kyrka: "img/icons/temp-icons/church.svg",
    slott: "img/icons/temp-icons/camping.svg",

    // Activities
    golfbana: "img/icons/temp-icons/golf.svg",
    simhall: "img/icons/temp-icons/swimming.svg",
    bowlinghall: "img/icons/temp-icons/bowling.svg",
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