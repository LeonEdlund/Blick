function init() {
  const pageId = document.querySelector("body").id 
  const choices = document.querySelectorAll(".choices a");
  
  
  if (pageId == "cities") {
    userLocation(); // get user location
  } 
  
  // save users choices
  choices.forEach((element) =>
    element.addEventListener("click", () => {
      switch (pageId) {
        case "cities":
          let location = {
            type: "button",
            param: element.id
          } 
          localStorage.setItem("location", JSON.stringify(location));
          break;
        case "category":
          let category = element.id;
          localStorage.setItem("type", category);
          break;
      }
    })
  );

}
window.addEventListener("load", init);

// save users location
function userLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
  function success(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", long);
  }

  function error(error) {
    document.querySelector("#my-position").href = "#";
    localStorage.removeItem("latitude");
    localStorage.removeItem("longitude");
    console.log(error);
  }
}




