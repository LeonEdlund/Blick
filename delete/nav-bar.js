function init() {
  // change button in navbar
  let bodyId = document.querySelector("body").id;
  if (bodyId == "budget" || bodyId == "wishlist") {
    changeExploreBtn();
    return;
  }

  savePageLink();
}
window.addEventListener("load", init);




