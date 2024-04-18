const key = "KZmupnUS"; // API-Key

function init() {
  let id = Number(getId("id"));
  getData(id);
}
window.addEventListener("load", init);

// get ID
function getId(param) {
  const urlParam = new URLSearchParams(window.location.search);
  return urlParam.get(param);
}

// Leon - get data from SMAPI
async function getData(id) {
  const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&ids=${id}`);
  const data = await response.json();
  if (data.header.status === `OK`) {
    //console.log(data.payload);
    generateHTML(data.payload[0]);
  } else {
    console.log(data.header);
  }
}

function generateHTML(data) {
  console.log(data);
  document.querySelector("body").innerHTML = `
  <h1>${data.name}</h1>
  <h2>Kategori: ${data.description}</h2>
  <h2>Prisklass: ${data.price_range}</h2>
  <h3>Information</h3>
  <p>${data.text}</p>
  `;
}