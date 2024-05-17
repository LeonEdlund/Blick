let spendings = []//ALEX - array för utgifter
let amountSpent = 0;//ALEX -  hur mycket användaren spenderat
let minBudget = 0;//ALEX - Användarens budget
let fromResultOne;
let fromResultTwo;
let names = []
//ALEX-initiering av programmet
function init() {
    let radioLabels = document.querySelectorAll(".option-label")
    for(let a= 0; a <radioLabels.length; a++){
        radioLabels[a].addEventListener("click", function(){
            radioLabelsFunc(this)
        })
    }
    if (!localStorage.getItem("minBudget")) {
        let getBudget = localStorage.getItem("minBudget")
        minBudget = parseInt(getBudget)
        newTripFunc(false)
        
    }
    if(localStorage.getItem("minBudget")){
        let value = localStorage.getItem("minBudget")
        minBudget = parseInt(value)
        console.log(minBudget)
        setBudget()
    }
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
    window.addEventListener("click", function(e){
        if(e.target == newTripDialog ){
            console.log("hej")
            newTripDialog.close()
        }
    })
    let exit = document.querySelector("#close-modal")
    exit.addEventListener("click", function () {
        newTripDialog.close();
    })
    let input = document.querySelector("#money-to-spend")
    input.setAttribute("class", "exempel")
    input.value = "ex. 5000kr"
    input.blur()
    input.addEventListener("focus", function(){
        input.value = "";
        input.setAttribute("class", "")
    })
    input.addEventListener("blur", function(){
        if(input.value == ""){
            input.setAttribute("class", "exempel")
            input.value = "ex. 5000kr" 
        }
    })
    let save = document.querySelector("#save")
    save.addEventListener("click", function () { checkIfNumber(newTripDialog, input, true) })
    
    if (wrong == true) {
        input.style.borderColor = "#972A2A";
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
    if (newBudget == false) {
    let nameElem = document.querySelector("#name")
            let name = nameElem.value
            if(name == ""||name == "NAMN"){
            newSpendFunc("needs name")
            return;
            }else{nameElem.style.borderColor = ""}
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
    budgetElemLeft.innerHTML = "Av: " + minBudget+ ".00";
    let budgetElem = document.querySelector("#kvar")
    budgetElem.innerHTML = (minBudget - amountSpent) + ".00";
}
//ALEX - Öppnar dialog för att användaren ska kunna fylla i en ny utgift
function newSpendFunc(wrong) {
    let name = document.querySelector("#name")
    
    if(name.value == ""||name.value == "NAMN"){name.value = "NAMN"
    name.setAttribute("class", "exempel")
    }
    name.addEventListener("focus", function(){
        name.value = ""
        name.setAttribute("class", "")
    })
    name.addEventListener("blur", function(){
        let clear = null
        searchFunc(clear)
        if(name.value == ""||name.value == "NAMN"){
            name.setAttribute("class", "exempel")
            name.value = "NAMN" 
        }
    })
    name.addEventListener("input", function () {
    searchFunc(name.value) })
    let newSpendDialog = document.querySelector("#new-spend-dialog")
    newSpendDialog.showModal()
    window.addEventListener("click", function(e){
        if(e.target == newSpendDialog ){
            newSpendDialog.close()
        }})
    let exit = document.querySelector("#exit")
    exit.addEventListener("click", function () {
        newSpendDialog.close();
        fromResult = "";
    })
    let input = document.querySelector("#amount")
    if (input.value == "PRIS"||input.value == "" ){
        input.setAttribute("class", "exempel")
        input.value = "PRIS"
    }
    
    input.addEventListener("focus", function(){
        input.value = ""
        input.setAttribute("class", "")
    })
    input.addEventListener("blur", function(){
    searchFunc(null)
    if(input.value == ""){
        input.setAttribute("class", "exempel")
        input.value = "PRIS" 
    }
    })
    let save = document.querySelector("#close")
    let cloneSave = save.cloneNode(true)
    save.parentElement.replaceChild(cloneSave, save)
    cloneSave.addEventListener("click", function () { checkIfNumber(newSpendDialog, input, false) })
    if (wrong == false) {
        input.setAttribute("class", "exempel")
        input.value = "PRIS"
        input.style.borderColor = "";
        name.style.borderColor = "";
        return;
    }
    if (wrong == true) {
        input.style.borderColor = "#972A2A";
        return;
        }
    
    if (wrong == fromResult) {
        let name = document.querySelector("#name")
        let radio = document.querySelector("#"+fromResultTwo)
        console.log(radio.parentElement)
        radio.checked = true;
        let radioParent = radio.parentElement
        console.log(radioParent)
        radioLabelsFunc(radioParent)
        name.value = fromResultOne
        return;

    }

    if(wrong == "needs name"){
        name.style.borderColor = "#972A2A";
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
        listSpednings();
    }
}
//hämmtar sessionStorage som sparas i result.html och startar sedan inläggningen av denna i budgeten
function fromResultFunc() {
    if (fromResult == null || fromResult == "") {
        return;
    }
    fromResult = JSON.parse(fromResult)
    console.log(fromResult.cat)
    fromResultOne = fromResult.dataName
    fromResultTwo = fromResult.cat
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
    
    let search = document.querySelector("#results-budget")
    if(input == null){
        search.innerHTML = "";
        return;
    }
    
    let searchWord = input.toLowerCase()
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
    if(input == null){
        search.innerHTML = "";
    }
}
function radioLabelsFunc(radioLabel){
    console.log(radioLabel)
    let radioLabels = document.querySelectorAll(".option-label")
    for(let h=0; h < radioLabels.length; h++){
        radioLabels[h].style.backgroundColor=""
        radioLabels[h].firstChild.checked = false;
    }
    radioLabel.firstChild.checked = true;
    for(let h=0; h < radioLabels.length; h++){
        if(radioLabels[h].firstChild.checked == true){
            radioLabels[h].style.backgroundColor="rgb(190, 183, 183)"
        }
    }
}
