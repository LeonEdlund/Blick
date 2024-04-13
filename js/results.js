const key = "KZmupnUS"; // API-Key
let chosenLocation; // vald plats
const type = "types=" + localStorage.getItem("type"); // get type of category from local storage

// get location from local storage
if (localStorage.getItem("location") == "öland"){
  chosenLocation = "provinces=" + localStorage.getItem("location");
} else {
  chosenLocation = "cities=" + localStorage.getItem("location"); 
}

// get data when page loads
getData();

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