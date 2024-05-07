let spendings = []//ALEX - array för utgifter
let amountSpent = 0;//ALEX -  hur mycket användaren spenderat
let minBudget = 0;//ALEX - Användarens budget
let fromResultOne;
let fromResultTwo;
let names = []
//ALEX-initiering av programmet
function init() {
    let getBudget = localStorage.getItem("minBudget")
    minBudget = parseInt(getBudget)
    console.log(minBudget)
    if (minBudget == null || minBudget == ""||minBudget== NaN) {
        newTripFunc()
    } else (setBudget())
    getStorage();
    getSearchData()
    fromResult = sessionStorage.getItem("fromResult")
    fromResultFunc()

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

//ALEX - öppnar en dialog för att användaren ska kunna skriva in sin budget för resan
function newTripFunc(wrong) {
    let newTripDialog = document.querySelector("#new-trip-dialog");
    newTripDialog.showModal()

    let input = document.querySelector("#money-to-spend")
    let save = document.querySelector("#save")
    save.addEventListener("click", function () { checkIfNumber(newTripDialog, input, true) })


    if (wrong == true) {
        input.style.backgroundColor = "red";
    }

}
//ALEX - Kontrollerar ifall användaren skrivit in siffror i dialogen och kallar därefter på adekvat funktion 
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

    if (!isNaN(number)) {

        if (newBudget == false) {
            let nameElem = document.querySelector("#name")
            let name = nameElem.value
            let category;
            let options = document.querySelectorAll(".option");
            for (let a = 0; a < options.length; a++) {
                if (options[a].checked) {
                    category = options[a].getAttribute("id")
                    options[a].checked = false;
                }
            }
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
//ALEX - Sätter budgeten och räknar ut vad som är kvar av den
function setBudget() {
    localStorage.setItem("minBudget", minBudget)
    let budgetElemLeft = document.querySelector("#av")
    budgetElemLeft.innerHTML = "Av: " + minBudget;
    let budgetElem = document.querySelector("#kvar")
    budgetElem.innerHTML = (minBudget - amountSpent) + " Kr";
}
//ALEX - Öppnar dialog för att användaren ska kunna fylla i en ny utgift
function newSpendFunc(wrong) {
    let name = document.querySelector("#name")
    name.addEventListener("input", function () { searchFunc(name.value) })
    let newSpendDialog = document.querySelector("#new-spend-dialog")
    newSpendDialog.showModal()
    let exit = document.querySelector("#exit")
    exit.addEventListener("click", function () {
        newSpendDialog.close();
        fromResult = "";
    })
    let input = document.querySelector("#amount")
    input.value = ""
    let save = document.querySelector("#close")
    let cloneSave = save.cloneNode(true)
    save.parentElement.replaceChild(cloneSave, save)
    cloneSave.addEventListener("click", function () { checkIfNumber(newSpendDialog, input, false) })
    if (wrong == false) {
        name.value == ""
        input.style.backgroundColor = "";
        return;
    }
    if (wrong == true) {
        input.style.backgroundColor = "red";
        return;
    }
    if (wrong == fromResult) {
        let name = document.querySelector("#name")
        let radio = document.querySelector(fromResultTwo)
        radio.checked = true;
        name.value = fromResultOne
        return;

    }
}
//ALEX - Constructor för objekt för utgift
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
    for (b = 0; b < spendings.length; b++) {
        let c = spendings[b];
        console.log(b)
        console.log(c)
        ul.innerHTML += "<li class='" + c.category + "'><div><h3>" + c.name + "</h3>" + c.price + " Kr" + "</div>" + "<button class='remove'>Ta bort</button></li>"
        amountSpent += c.price
    }
    removeBtnFunc()
    calculatePerCategory()
    setBudget()
    setStorage()
}
//ALEX - räkna ut spenderat per kategori
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
            <img src="img/culture.svg" alt=""></img>
            <p>Boende</p>
        </div>
        <p class="spent">${catOne} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/culture.svg" alt=""></img>
            <p>Resa</p>
        </div>
        <p class="spent">${catTwo} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/food.svg" alt=""></img>
            <p>Mat & Dryck</p>
        </div>
        <p class="spent">${catThree} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/activities.svg" alt=""></img>
            <p>Aktiviteter</p>
        </div>
        <p class="spent">${catFour} Kr</p>
    </li>
    <li>
        <div>
            <img src="img/icons/budget.svg" alt=""></img>
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

function removeBtnFunc(remove, e) {
    let removeBtns = document.querySelectorAll(".remove")
    for (let f = 0; f < removeBtns.length; f++) {
        removeBtns[f].addEventListener("click", function () { removeBtnFunc(true, this.parentElement) })
    }
    if (remove == true) {
        spendings.splice(e, 1)
        console.log(spendings);
        listSpednings();
    }
}
//hämmtar sessionStorage som sparas i result.html och startar sedan inläggningen av denna i budgeten
function fromResultFunc() {
    if (fromResult == null || fromResult == "") {
        return;
    }
    let storageArray = fromResult.split("&")
    fromResultOne = storageArray[0]
    fromResultTwo = "#" + storageArray[1]
    sessionStorage.setItem("fromResult", "")
    newSpendFunc(fromResult)

}
//sparar användarens val
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
//hämtar tidigare val 
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
            console.log(spendings)
            listSpednings()
        }
    }
}

async function getSearchData() {
    let response = await fetch("https://smapi.lnu.se/api/?api_key=KZmupnUS&controller=establishment&method=getAll")
    let responseTwo = await response.json()
    let data = responseTwo.payload

    for (let u = 0; u < data.length; u++) {
        names.push(data[u].name)
    }
}

function searchFunc(input) {
    let searchWord = input.toLowerCase()
    let search = document.querySelector("#results-budget")
    console.log(searchWord)
    if (input == "") {
        search.innerHTML = "";
        return;
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
}

