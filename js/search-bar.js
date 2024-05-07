const key = "KZmupnUS";
let dataArray = [];
let cityArray = [];

function init() {
    document.getElementById("search").addEventListener("click", () => {
        getData();
        openSearch()  
    });
    document.getElementById("searchbar").addEventListener("input", searchFunc);
    document.querySelector("#close-btn").addEventListener("click", closeSearch);
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
        if (!cityArray.includes(dataArray[i].city)) {
            cityArray.push(dataArray[i].city);
        }
    }
}

// Jesper - Compare users input with names in the array
async function searchFunc() {
    const searchTerm = document.getElementById("searchbar").value.toLowerCase();
    const resultsDiv = document.getElementById("results");

    if (!searchTerm) {
        resultsDiv.innerHTML = "";
        return;
    }

    let listItems = "";
    for (let i = 0; i < cityArray.length; i++) {
        if (cityArray[i] && cityArray[i].toLowerCase().includes(searchTerm)) {
            listItems += `
            <li>
                <a href="categories.html" onclick='saveData("${cityArray[i]}")'>${cityArray[i]}</a>
            </li>`;
        }
    }
    resultsDiv.innerHTML = listItems || "<li>Inget hittades</li>";
}

function saveData(city) {
    const cityToSave = {
        type: "search",
        param: `cities=${city}`
    }
    localStorage.setItem("location", JSON.stringify(cityToSave));
}

function closeSearch() {
    document.querySelector("#search-box-active").style.display = "none";
    document.querySelector("body").style.overflow = "scroll";
}

function openSearch() {
    document.querySelector("body").style.overflow = "hidden";
    document.querySelector("#search-box-active").style.display = "block";
    document.querySelector("#searchbar").focus();
}

