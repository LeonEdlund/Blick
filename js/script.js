let spendings = []//ALEX - array för utgifter
let amountSpent = 0;//ALEX -  hur mycket användaren spenderat
let minBudget = 0;//ALEX - Användarens budget
//ALEX-initiering av programmet
function init() {

    let newTripBtn = document.querySelector("#newTripBtn")
    newTripBtn.addEventListener("click", newTripFunc)

    let newSpendBtn = document.querySelector("#newSpendBtn")
    newSpendBtn.addEventListener("click", newSpendFunc)

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
        console.log("hej")
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
    let newSpendDialog = document.querySelector("#newSpendDialog")
    newSpendDialog.showModal()

    let input = document.querySelector("#amount")

    let save = document.querySelector("#close")
    save.addEventListener("click", function () { checkIfNumber(newSpendDialog, input, false) })

    if (wrong == true) {
        input.style.backgroundColor = "red";
    }
}
//ALEX - Constructor för objekt för utgift
function Spending(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;

    listSpednings()
}
//ALEX - Skriver ut alla utgifter
function listSpednings() {
    let ul = document.querySelector("#ul")
    ul.innerHTML = ""
    console.log(spendings)
    for (b = 0; b < spendings.length; b++) {
        let c = spendings[b];
        ul.innerHTML = "<li class='" + c.category + "'><h3>" + c.category + "</h3>" + c.name + " för " + c.price + "</li>"
        amountSpent += c.price
    }
    calculatePerCategory()
    setBudget()
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
            case "cat1":
                catOne += spendings[d].price;
            case "cat2":
                catTwo += spendings[d].price;
            case "cat3":
                catThree += spendings[d].price;
            case "cat4":
                catFour += spendings[d].price;
            case "cat5":
                catFive += spendings[d].price;
        }
    }
    let general = document.querySelector("#general");
    general.innerHTML = "<li> cat1 " + catOne + "</li><li> cat2 " + catTwo + "</li><li> cat3 " + catThree + "</li><li> cat4 " + catFour + "</li><li> cat5 " + catFive + "</li>"

    let generalCat = document.querySelectorAll("#general li")
    for (let e = 0; e < generalCat.length; e++) {
        if (generalCat[e].innerHTML == 0) {
            console.log("hej")
            generalCat[e].style.visbility = hidden;
        }
    }

}