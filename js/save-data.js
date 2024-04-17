const storageLocationName = "location";
const storageTypeName = "type";
const pageId = document.querySelector("body").id 
const choices = document.querySelectorAll(".choices a");

if (pageId == "cities") userLocation(); // get user location

// save users choices
choices.forEach((element) =>
  element.addEventListener("click", () => {
    switch (pageId) {
      case "cities":
        let location = element.id;
        localStorage.removeItem(storageLocationName);
        localStorage.setItem(storageLocationName, location);
        break;
      case "category":
        let category = element.id;
        localStorage.removeItem(storageTypeName);
        localStorage.setItem(storageTypeName, category);
        break;
    }
  })
);

// save users location
function userLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
  function success(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    localStorage.removeItem("latitude");
    localStorage.setItem("latitude", lat);
    localStorage.removeItem("longitude");
    localStorage.setItem("longitude", long);
    console.log(localStorage.getItem("longitude"));
    console.log(localStorage.getItem("latitude"));
    //window.location.href = "categories.html";
  }

  function error(error) {
    console.log(error);
  }
}




