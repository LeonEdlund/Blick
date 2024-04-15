const key = "KZmupnUS"; // API-Key
let storedLocation; // location from localStorage
let chosenLocation; // chosen location for SMAPI
let chosenType; // chosen category for SMAPI
let type;

function init() {
  type = localStorage.getItem("type");
  storedLocation = localStorage.getItem("location");

  // get location from local storage
  if (storedLocation == "öland") {
    chosenLocation = "provinces=" + localStorage.getItem("location");
  } else {
    chosenLocation = "cities=" + localStorage.getItem("location");
  }

  switch(type) {
    case "food":
      type = "types=food"
      changeTitle("mat & dryck");
      break;
    case "nature":
      type = "types=activity"
      changeTitle("naturupplevelser");
      break;
    case "culture":
      type = "types=activity"
      changeTitle("kultur");
      break;
    case "activity":
      type = "types=activity"
      changeTitle("aktiviteter");
  }

  // get data when page loads
  getData();
}
window.addEventListener("load", init);

// change title on page
function changeTitle (category) {
  let title = document.querySelector("#page-title");
  title.innerText = category;
}

// get data from SMAPI
async function getData() {
  const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&${type}&${chosenLocation}`);
  const data = await response.json();
  if (data.header.status === `OK`) {
    console.log(data.payload);
    printResults(data.payload);
  } else {
    console.log(data.header);
  }
}

// Prints results from SMAPI in list
function printResults(data) {
  const list = document.querySelector("#list-of-results");
  list.innerHTML = "";
  data.forEach((result) => {
    console.log(result)

    // create all elements
    const newLi = document.createElement("li");
    const newLink = document.createElement("a");
    const resultInfoDiv = document.createElement("div");
    const img = document.createElement("img");
    const titleElem = document.createElement("h2");
    const descriptionElem = document.createElement("p");
    const distanceElem = document.createElement("p");

    // add info to link
    newLink.href = "#"
    newLink.classList.add("list-item");
    newLi.appendChild(newLink);

    // add info to result-info-div
    resultInfoDiv.classList.add("result-info");
    
    // add info to img
    img.src = "temporary-img/Artboard 1.svg";
    
    // add info to titleElem
    const title = document.createTextNode(`${result.name}`);
    titleElem.appendChild(title);
    
    
    // add info to typeElem
    const description = document.createTextNode(`${result.description}`);
    descriptionElem.appendChild(description);
    
    // add elements to resultInfoDiv
    resultInfoDiv.appendChild(titleElem);
    resultInfoDiv.appendChild(descriptionElem);
    
    // add elements to newLink
    newLink.appendChild(img);
    newLink.appendChild(resultInfoDiv);

    // print out elements on page
    list.appendChild(newLi);
  });
}