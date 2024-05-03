const key = "KZmupnUS";

function init() {
    document.getElementById("searchbar").addEventListener("input", searchFunc);
}
window.addEventListener("load", init);

async function searchFunc() {
    const searchTerm = document.getElementById("searchbar").value.toLowerCase();


    const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getall`);

    if (!response.ok){
        console.log("Fel!")
    }

    const apiData = await response.json();
    const data = apiData.payload;

    const resultsDiv = document.getElementById("results");
    let listItems = "";

    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (item.name && item.name.toLowerCase().includes(searchTerm)) {
            listItems += `<li>${item.name}</li>`;
        }
        if (searchTerm == ""){
            listItems = "";
        }
    }
    resultsDiv.innerHTML = listItems || "<li>Inget hittades</li>";
    

}

