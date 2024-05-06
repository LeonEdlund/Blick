const key = "KZmupnUS";
let dataArray = [];
let cityArray = [];

function init() {
    document.getElementById("searchbar").addEventListener("input", searchFunc);
    getData();
}
window.addEventListener("load", init);

// Jesper - Saves data from SMAPI in an array
async function getData() {
    const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getall`);

    if (!response.ok) {
        console.log("Fel!");
        return;
    }

    const apiData = await response.json();
    dataArray = apiData.payload;

    for (let i = 0; i < dataArray.length; i++) {
        if (!cityArray.includes(dataArray[i].municipality)) {
            cityArray.push(dataArray[i].municipality);
        }
    }
}

// Jesper - Compare users input with names in the array
async function searchFunc() {
    const searchTerm = document.getElementById("searchbar").value.toLowerCase();

    const resultsDiv = document.getElementById("results");
    let listItems = "";

    for (let i = 0; i < cityArray.length; i++) {
        if (cityArray[i] && cityArray[i].toLowerCase().includes(searchTerm)) {
            listItems += `<li><a href="categories.html" onclick='saveData("${cityArray[i]}")'>${cityArray[i]}</a></li>`;
        }
        if (searchTerm == "") {
            listItems = "";
        }
    }
    resultsDiv.innerHTML = listItems || "<li>Inget hittades</li>";

}

function saveData(city) {
    localStorage.setItem("location", `cities=${city}`)
}

