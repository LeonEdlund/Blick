let spendings = []//ALEX - array för utgifter
let amountSpent = 0;//ALEX -  hur mycket användaren spenderat
let minBudget = 0;//ALEX - Användarens budget
let fromResult;
//ALEX-initiering av programmet
function init() {
    getStorage()
    fromResult = document.cookie
    if(fromResult.length > 0){
        cookieFunc()
    }

    let newTripBtn = document.querySelector("#changeBudget")
    newTripBtn.addEventListener("click", newTripFunc)

    let newSpendBtn = document.querySelector("#newSpendBtn")
    newSpendBtn.addEventListener("click", newSpendFunc)

    let removeTrip = document.querySelector("#removeTrip")
    removeTrip.addEventListener("click", function(){location.reload()})

}
window.addEventListener("load", init)

//ALEX - öppnar en dialog för att användaren ska kunna skriva in sin budget för resan
function newTripFunc(wrong) {
    let newTripDialog = document.querySelector("#newTripDialog");
    newTripDialog.showModal()

    let input = document.querySelector("#moneyToSpend")

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
                }
            }
            spendings.push(new Spending(name, number, category))
            listSpednings()
        }


        if (newBudget == true) {
            minBudget = number
            setBudget()
        }
    }


}
//ALEX - Sätter budgeten och räknar ut vad som är kvar av den
function setBudget() {
    let budgetElemLeft = document.querySelector("#av")
    budgetElemLeft.innerHTML = minBudget
    let budgetElem = document.querySelector("#kvar")
    budgetElem.innerHTML = (minBudget - amountSpent)
}
//ALEX - Öppnar dialog för att användaren ska kunna fylla i en ny utgift
function newSpendFunc(wrong) {
    let name = document.querySelector("#name")
    name.value = ""
    let newSpendDialog = document.querySelector("#newSpendDialog")
    newSpendDialog.showModal()

    let input = document.querySelector("#amount")

    let save = document.querySelector("#close")
    let cloneSave = save.cloneNode(true)
    save.parentElement.replaceChild(cloneSave, save)
    cloneSave.addEventListener("click", function () { checkIfNumber(newSpendDialog, input, false) })

    if (wrong == true) {
        input.style.backgroundColor = "red";
    }
    if (wrong = fromResult){
        let name = document.querySelector("#name")
        name.value = fromResult
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
        ul.innerHTML += "<li class='" + c.category + "'><h3>" + c.name + "</h3>" + " För: " + c.price + "<button class='remove'>Ta bort</button></li>"
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
            case "boende":
                catOne += spendings[d].price
                break;
            case "resa":
                catTwo += spendings[d].price
                break;
            case "MatochDryck":
                catThree += spendings[d].price
                break;
            case "Aktiviteter":
                catFour += spendings[d].price
                break;
            case "övrigt":
                catFive += spendings[d].price
                break;
        }
    }
    let general = document.querySelector("#general");
    general.innerHTML = "<li> Boende <p>" + catOne + "</p></li><li> Resa <p>" + catTwo + "</p></li><li> Mat och Dryck <p>" + catThree + "</p></li><li> Aktiviteter <p>" + catFour + "</p></li><li> Övrigt <p>" + catFive + "</p></li>"

    let generalCat = document.querySelectorAll("#general li p")
    console.log(generalCat)
    for (let e = 0; e < generalCat.length; e++) {
        console.log(generalCat[e].innerHTML)
        if (generalCat[e].innerHTML == 0) {
            generalCat[e].parentElement.style.display = "none";
        }
    }

}

function removeBtnFunc(remove, e){
    let removeBtns = document.querySelectorAll(".remove")
    for(let f = 0; f < removeBtns.length; f++){
        removeBtns[f].addEventListener("click", function(){removeBtnFunc(true, this.parentElement)})
    }
    if(remove == true){
        spendings.splice(e, 1)
        console.log(spendings);
        listSpednings();
    }
}
//hämmtar cookie som sparas i result.html och startar sedan inläggningen av denna i budgeten
function cookieFunc(){
    let cookieArray = fromResult.split("=")
    fromResult = cookieArray[1]
    newSpendFunc(fromResult)

}
//sparar användarens val
function setStorage(){
let dataToSave = "/";
for(let j = 0; j < spendings.length; j++){
let name = spendings[j].name
let price = spendings[j].price
let category = spendings[j].category
dataToSave+=name+"&"+price+"&"+category+"/"
}
console.log(dataToSave)
localStorage.setItem("storedData", dataToSave) 
}
//hämtar tidigare val 
function getStorage(){
    let storedData = localStorage.getItem("storedData")
    if(storedData == null){
        return;
    }
    let dataArray = storedData.split("/")
    for(let l = 0; l < dataArray.length; l++){
        if(dataArray[l].length > 0){
        let dataArrayArray = dataArray[l].split("&")
        spendings.push(new Spending(dataArrayArray[0], parseInt(dataArrayArray[1]), dataArrayArray[2]))
        console.log(spendings)
        listSpednings()
        }
    }
}