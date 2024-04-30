function init() {
  // change button in navbar
  let bodyId = document.querySelector("body").id;
  if (bodyId == "budget" || bodyId == "wishlist") {
    changeExploreBtn();
    return;
  }

  // save last location
  let location = window.location.pathname.substring(1);
  localStorage.setItem("lastLocation", location);
  // save id of last location
  if (window.location.search) {
    let locationId = window.location.search;
    localStorage.setItem("lastLocationId", locationId);
  }
}
window.addEventListener("load", init);

// Leon - Change href for "explore btn"
function changeExploreBtn() {
  let storedLocation = localStorage.getItem("lastLocation");
  let storedLocationId = localStorage.getItem("lastLocationId");

  if (storedLocation) {
    document.querySelector(".explore-btn").href = storedLocation;
  };

  if(storedLocationId) {
    document.querySelector(".explore-btn").href += storedLocationId;
  }
  
}