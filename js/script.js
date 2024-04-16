let nyResaDialog;
let utgiftDialog;
let nyUtgiftKnapp;
let minBudget;
let utgifter=[];
let nyResaInput;
let nyUtgiftInput;

//ALEX-initiering av programmet
function init(){
    let newTripBtn = document.querySelector("#newTripBtn")
    newTripBtn.addEventListener("click", newTripFunc)
    
}
window.addEventListener("load", init)

//ALEX - öppnar en dialog för att användaren ska kunna skriva in sin budget för resan
function newTripFunc(wrong){
    let newTripDialog = document.querySelector("#newTripDialog");
    newTripDialog.showModal()

    let save = document.querySelector("#save")
    save.addEventListener("click", function(){checkIfNumber(newTripDialog)})

    if(wrong == true){
        let input = document.querySelector("#moneyToSpend")
        input.style.backgroundColor = "red";
    }
    
}
//ALEX - Kontrollerar ifall användaren skrivit in siffror i dialogen
function checkIfNumber(close){
    close.close()
    
    let input = document.querySelector("#moneyToSpend")
    
    minBudget = parseInt(input.value)
    
    if(isNaN(minBudget)){
        newTripFunc(true)
        return;
    }
    setBudget()
}

//ALEX - Sätter budgeten
function setBudget (){
    let budgetElem = document.querySelector("#av")
    budgetElem.innerHTML = minBudget
}