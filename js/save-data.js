const storageLocationName = "location";
const storageTypeName = "type";
const pageId = document.querySelector("body").id 

// if(document.querySelector("body").id == "cities") {
//   console.log("hej");
//   const cities = document.querySelectorAll(".cities a");

//   cities.forEach((element) => 
//     element.addEventListener("click", () => {
//       let location = element.id;
//       localStorage.removeItem(storageLocationName)
//       localStorage.setItem(storageLocationName, location);
//     })
//   );
// };

// if (document.querySelector("body").id == "category") {
//   console.log("hej då");
//   const categories = document.querySelectorAll(".categories a");

//   categories.forEach((element) =>
//     element.addEventListener("click", () => {
//       let category = element.id;
//       localStorage.removeItem(storageTypeName)
//       localStorage.setItem(storageTypeName, category);
//     })
//   );
// };




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




