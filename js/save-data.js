const storageLocationName = "location";
const storageTypeName = "type";
const pageId = document.querySelector("body").id 
const choices = document.querySelectorAll(".choices a");

choices.forEach((element) =>
  element.addEventListener("click", () => {
    switch (pageId) {
      case "cities":
        let location = element.id;
        localStorage.removeItem(storageLocationName)
        localStorage.setItem(storageLocationName, location);
        break;
      case "category":
        let category = element.id;
        localStorage.removeItem(storageTypeName)
        localStorage.setItem(storageTypeName, category);
        break;
    }
  })
);




