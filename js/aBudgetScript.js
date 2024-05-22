import { changeExploreBtn } from "/js/utils.js";

let spendings = []//ALEX - array for expenditures
let amountSpent = 0;//ALEX -  the amount spent by the user
let minBudget = 0;//ALEX - the user budget
let fromResult;
let fromResultOne;
let fromResultTwo;
let names = []
//ALEX-initializes the page  
function init() {
    let radioLabels = document.querySelectorAll(".option-label")
    for (let a = 0; a < radioLabels.length; a++) {
        radioLabels[a].addEventListener("click", function () {
            radioLabelsFunc(this)
        })
    }
    if (!localStorage.getItem("minBudget")) {
        let getBudget = localStorage.getItem("minBudget")
        minBudget = parseInt(getBudget)
        newTripFunc(false)

    }
    if (localStorage.getItem("minBudget")) {
        let value = localStorage.getItem("minBudget")
        minBudget = parseInt(value)
        setBudget()
    }
    getStorage();
    getSearchData()
    fromResult = sessionStorage.getItem("fromResult")
    fromResultFunc()
    changeExploreBtn()
    let newTripBtn = document.querySelector("#remove-trip")
    newTripBtn.addEventListener("click", function () {
        let removeBtns = document.querySelectorAll(".remove")
        for (let f = 0; f < removeBtns.length; f++) {
            removeBtnFunc(true, removeBtns[f].parentElement)
        }
        listSpednings()
        newTripFunc(false)
    })

    let newSpendBtn = document.querySelector("#new-spend-btn")
    newSpendBtn.addEventListener("click", function () { newSpendFunc(false) })

    let removeTrip = document.querySelector("#change-budget")
    removeTrip.addEventListener("click", function () { newTripFunc() })

}
window.addEventListener("load", init)

//ALEX - opens a dialog for the user to write their budget
function newTripFunc(wrong) {
    let newTripDialog = document.querySelector("#new-trip-dialog");
    newTripDialog.showModal()
    let exit = document.querySelector("#close-modal")
    exit.addEventListener("click", function () {
        newTripDialog.close();
    })
    let input = document.querySelector("#money-to-spend")
    input.setAttribute("class", "exempel")
    input.value = "ex. 5000kr"
    input.blur()
    input.addEventListener("focus", function () {
        input.value = "";
        input.setAttribute("class", "")
    })
    input.addEventListener("blur", function () {
        if (input.value == "") {
            input.setAttribute("class", "exempel")
            input.value = "ex. 5000kr"
        }
    })
    let save = document.querySelector("#save")
    save.addEventListener("click", function () { checkIfNumber(newTripDialog, input, true) })

    if (wrong == true) {
        input.style.borderColor = "#972A2A";
    }

    window.addEventListener("click", function (e) {
        if (e.target == newTripDialog) {
            input.value = ""
            newTripDialog.close()
        }
    })
}
//ALEX - checks if a the correct input is provided by the user
function checkIfNumber(close, input, newBudget) {
    close.close()

    let number = parseInt(input.value)

    if (isNaN(number)) {
        if (newBudget == true) {
            newTripFunc(true)
        }
        if (newBudget == false) {
            newSpendFunc(true)

        }

    }
    if (newBudget == false) {
        let nameElem = document.querySelector("#name")
        let name = nameElem.value
        if (name == "" || name == "NAMN") {
            newSpendFunc("needs name")
            return;
        } else { nameElem.style.borderColor = "" }
    }
    if (!isNaN(number)) {

        if (newBudget == false) {
            let category;
            let options = document.querySelectorAll(".option");
            for (let a = 0; a < options.length; a++) {
                if (options[a].checked) {
                    category = options[a].getAttribute("id")
                    options[a].checked = false;
                }
            }
            let nameElem = document.querySelector("#name")
            let name = nameElem.value
            spendings.unshift(new Spending(name, number, category))
            listSpednings()
            nameElem.value = ""

        }


        if (newBudget == true) {
            minBudget = number
            setBudget()
        }
    }


}
//ALEX - Sets the budget
function setBudget() {
    localStorage.setItem("minBudget", minBudget)
    let budgetElemLeft = document.querySelector("#av")
    budgetElemLeft.innerHTML = "Av: " + minBudget + ".00";
    let budgetElem = document.querySelector("#kvar")
    budgetElem.innerHTML = (minBudget - amountSpent) + ".00";
    checkHeaderColor(budgetElem);

}

//ALEX - opens dialog for the user to put in an expenditure
function newSpendFunc(wrong) {
    let name = document.querySelector("#name")
    if (name.value == "" || name.value == "NAMN") {
        name.value = "NAMN"
        name.setAttribute("class", "exempel")
    }
    name.addEventListener("focus", function () {
        name.value = ""
        name.setAttribute("class", "")
    })
    name.addEventListener("blur", function () {
        if (name.value == "" || name.value == "NAMN") {
            name.setAttribute("class", "exempel")
            name.value = "NAMN"
        }
    })
    name.addEventListener("input", function () {
        searchFunc(name.value)
    })
    let newSpendDialog = document.querySelector("#new-spend-dialog")
    newSpendDialog.showModal()
    let exit = document.querySelector("#exit")
    exit.addEventListener("click", function () {
        let options = document.querySelectorAll(".option");
        for (let a = 0; a < options.length; a++) {
            if (options[a].checked) {
                options[a].checked = false;
                radioLabelsFunc(null)
            }
        }
        name.value = "NAMN"
        name.setAttribute("class", "exempel")
        input.setAttribute("class", "exempel")
        input.value = "PRIS"
        input.style.borderColor = "";
        name.style.borderColor = "";
        let search = document.querySelector("#results-budget")
        search.innerHTML = ""
        newSpendDialog.close();
        fromResult = "";
    })
    let input = document.querySelector("#amount")
    if (input.value == "PRIS" || input.value == "") {
        input.setAttribute("class", "exempel")
        input.value = "PRIS"
    }

    input.addEventListener("focus", function () {
        let search = document.querySelector("#results-budget")
        search.innerHTML = ""
        input.value = ""
        input.setAttribute("class", "")
    })
    input.addEventListener("blur", function () {
        if (input.value == "") {
            input.setAttribute("class", "exempel")
            input.value = "PRIS"
        }
    })
    let save = document.querySelector("#close")
    let cloneSave = save.cloneNode(true)
    save.parentElement.replaceChild(cloneSave, save)
    cloneSave.addEventListener("click", function () { checkIfNumber(newSpendDialog, input, false) })
    window.addEventListener("click", function (e) {
        if (e.target == newSpendDialog) {
            let options = document.querySelectorAll(".option");
            for (let a = 0; a < options.length; a++) {
                if (options[a].checked) {
                    options[a].checked = false;
                    radioLabelsFunc(null)
                }
            }
            name.value = "NAMN"
            name.setAttribute("class", "exempel")
            input.setAttribute("class", "exempel")
            input.value = "PRIS"
            input.style.borderColor = "";
            name.style.borderColor = "";
            let search = document.querySelector("#results-budget")
            search.innerHTML = ""
            newSpendDialog.close()
        }
    })
    if (wrong == false) {
        let options = document.querySelectorAll(".option");
        for (let a = 0; a < options.length; a++) {
            if (options[a].checked) {
                options[a].checked = false;
                radioLabelsFunc(null)
            }
        }
        name.value = "NAMN"
        name.setAttribute("class", "exempel")
        input.setAttribute("class", "exempel")
        input.value = "PRIS"
        input.style.borderColor = "";
        name.style.borderColor = "";
        let search = document.querySelector("#results-budget")
        search.innerHTML = ""
        return;
    }
    if (wrong == true) {
        input.style.borderColor = "#972A2A";
        return;
    }

    if (wrong == fromResult) {
        let name = document.querySelector("#name")
        let radio = document.querySelector("#" + fromResultTwo)
        radio.checked = true;
        let radioParent = radio.parentElement
        radioLabelsFunc(radioParent)
        name.value = fromResultOne
        return;

    }

    if (wrong == "needs name") {
        name.style.borderColor = "#972A2A";
    }

}
//ALEX - Constructor for object Spending
function Spending(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
}
//ALEX - Skriver ut alla utgifter
function listSpednings() {
    let ul = document.querySelector("#ul")
    ul.innerHTML = "";
    amountSpent = 0;
    for (let b = 0; b < spendings.length; b++) {
        let c = spendings[b];
        ul.innerHTML += "<li class='" + c.category + "'><div><h3>" + c.name + "</h3>" + c.price + " Kr" + "</div>" + `<button class="remove"><img src="img/icons/trash.svg" alt="ta bort utgift" aria-label="Ta bort utgift"></button></li>`
        amountSpent += c.price
    }
    removeBtnFunc()
    calculatePerCategory()
    setBudget()
    setStorage()
}

//ALEX - calculates per category
function calculatePerCategory() {
    let catOne = 0;
    let catTwo = 0;
    let catThree = 0;
    let catFour = 0;
    let catFive = 0;
    for (let d = 0; d < spendings.length; d++) {
        switch (spendings[d].category) {
            case "accommodation":
                catOne += spendings[d].price
                break;
            case "trip":
                catTwo += spendings[d].price
                break;
            case "food-drink":
                catThree += spendings[d].price
                break;
            case "activity":
                catFour += spendings[d].price
                break;
            case "other":
                catFive += spendings[d].price
                break;
        }
    }

    let general = document.querySelector("#general");
    general.innerHTML =
        `<li>
        <div>
            <img src="img/icons/categories/accommodation.svg" alt="Boende"></img>
            <p>Boende</p>
        </div>
        <p class="spent">${catOne} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/icons/categories/travel.svg" alt="Resa"></img>
            <p>Resa</p>
        </div>
        <p class="spent">${catTwo} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/icons/categories/food.svg" alt="Mat och dryck"></img>
            <p>Mat & Dryck</p>
        </div>
        <p class="spent">${catThree} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/icons/categories/activities.svg" alt="Aktiviteter"></img>
            <p>Aktiviteter</p>
        </div>
        <p class="spent">${catFour} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/icons/categories/else.svg" alt="Övrigt"></img>
            <p>Övrigt</p>
        </div>
        <p class="spent">${catFive} Kr</p>
    </li>`

    let generalCat = document.querySelectorAll(".spent");

    for (let e = 0; e < generalCat.length; e++) {
        if (generalCat[e].innerHTML == "0 Kr") {
            generalCat[e].parentElement.style.display = "none";
        };
    };
}
//Alex - Adds functionality for removing expenditure
function removeBtnFunc(remove, e) {
    let removeBtns = document.querySelectorAll(".remove")
    for (let f = 0; f < removeBtns.length; f++) {
        removeBtns[f].addEventListener("click", function () { removeBtnFunc(true, this.parentElement) })
    }
    if (remove == true) {
        spendings.splice(e, 1)
        listSpednings();
    }
}
//Alex - Gets the session-storage from result
function fromResultFunc() {
    if (fromResult == null || fromResult == "") {
        return;
    }
    fromResult = JSON.parse(fromResult)
    fromResultOne = fromResult.dataName
    fromResultTwo = fromResult.cat
    sessionStorage.setItem("fromResult", "")
    newSpendFunc(fromResult)

}
//Alex - saves the users choices
function setStorage() {
    let dataToSave = "/";
    for (let j = 0; j < spendings.length; j++) {
        let name = spendings[j].name
        let price = spendings[j].price
        let category = spendings[j].category
        dataToSave += name + "&" + price + "&" + category + "/"
    }
    localStorage.setItem("storedData", dataToSave)
}
//Alex - Gets the users previous choices
function getStorage() {
    let storedData = localStorage.getItem("storedData")
    if (storedData == null) {
        return;
    }
    let dataArray = storedData.split("/")
    for (let l = 0; l < dataArray.length; l++) {
        if (dataArray[l].length > 0) {
            let dataArrayArray = dataArray[l].split("&")
            spendings.unshift(new Spending(dataArrayArray[0], parseInt(dataArrayArray[1]), dataArrayArray[2]))
            listSpednings()
        }
    }
}
//Alex - Gets the suggestions
async function getSearchData() {
    let response = await fetch("https://smapi.lnu.se/api/?api_key=KZmupnUS&controller=establishment&method=getAll")
    let responseTwo = await response.json()
    let data = responseTwo.payload

    for (let u = 0; u < data.length; u++) {
        names.push(data[u].name)
    }
}
//Alex- Writes the suggestions
function searchFunc(input) {
    if (input == null) {

    }
    let search = document.querySelector("#results-budget")
    let searchWord = input.toLowerCase()
    if (input == "") {
        search.innerHTML = "";

    }
    let spaces = 0;
    search.innerHTML = "";
    for (let p = 0; p < names.length; p++) {
        let lowerCaseName = names[p].toLowerCase()
        if (lowerCaseName.includes(searchWord) == true) {
            search.innerHTML += "<li>" + names[p] + "</li>";
            spaces++
            if (spaces == 5) {
                break;
            }
        }
    }
    let searchResults = document.querySelectorAll("#results-budget li")
    for (let b = 0; b < searchResults.length; b++) {
        searchResults[b].addEventListener("click", function () {
            document.querySelector("#name").value = searchResults[b].innerHTML
            search.innerHTML = ""
        })
    }
    if (input == null) {
        search.innerHTML = "";
    }
}
//Alex- Makes the labels replace the radio inputs
function radioLabelsFunc(radioLabel) {
    let radioLabels = document.querySelectorAll(".option-label")
    for (let h = 0; h < radioLabels.length; h++) {
        radioLabels[h].style.backgroundColor = ""
        radioLabels[h].firstChild.checked = false;
    }
    radioLabel.firstChild.checked = true;
    for (let h = 0; h < radioLabels.length; h++) {
        if (radioLabels[h].firstChild.checked == true) {
            radioLabels[h].style.backgroundColor = "rgb(190, 183, 183)"
        }
    }
}

// Leon - change color of header if user overspends
function checkHeaderColor(budgetElem) {
    const header = document.querySelector("header")
    if (parseInt(budgetElem.textContent) < 0) {
        header.style.backgroundColor = "#8b0000";
    } else {
        header.style.backgroundColor = "var(--dark-green)";
    }
}