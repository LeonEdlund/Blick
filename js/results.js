const key = "KZmupnUS"; // API-Key
const chosenLocation = "&cities=" + localStorage.getItem("location"); // get location from local storage
const type = "&types=" + localStorage.getItem("type"); // get type of category from local storage

getData();

// get data from SMAPI
async function getData() {
  const response = await fetch(`https://smapi.lnu.se/api/?api_key=${key}&debug=true&controller=establishment&method=getAll&${type}&${chosenLocation}`);
  const data = await response.json();
  if (data.header.status === `OK`) {
    console.log(data.header);
    console.log(data.payload);
  } else {
    console.log(data.header);
  }
}