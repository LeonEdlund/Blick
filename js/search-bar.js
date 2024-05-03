const key = "KZmupnUS";
let dataArray = [];

function init() {
    document.getElementById("searchbar").addEventListener("input", searchFunc);
    getData();
}
window.addEventListener("load", init);

async function getData() {
    const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getall`);

    if (!response.ok){
        console.log("Fel!");
        return;
    }

    const apiData = await response.json();
    dataArray = apiData.payload;

}

async function searchFunc() {
    const searchTerm = document.getElementById("searchbar").value.toLowerCase();

    console.log(dataArray);

    const resultsDiv = document.getElementById("results");
    let listItems = "";

    for (let i = 0; i < dataArray.length; i++) {
        const item = dataArray[i];

        if (item.name && item.name.toLowerCase().includes(searchTerm)) {
            listItems += `<li>${item.name}</li>`;
        }
        if (searchTerm == ""){
            listItems = "";
        }
    }
    resultsDiv.innerHTML = listItems || "<li>Inget hittades</li>";
    

}

