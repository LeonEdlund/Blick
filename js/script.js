let spendings = []
//ALEX-initiering av programmet
function init(){

    let newTripBtn = document.querySelector("#newTripBtn")
    newTripBtn.addEventListener("click", newTripFunc)

    let newSpendBtn = document.querySelector("#newSpendBtn")
    newSpendBtn.addEventListener("click", newSpendFunc)
    
}
window.addEventListener("load", init)

//ALEX - öppnar en dialog för att användaren ska kunna skriva in sin budget för resan
function newTripFunc(wrong){
    let newTripDialog = document.querySelector("#newTripDialog");
    newTripDialog.showModal()

    let input = document.querySelector("#moneyToSpend")

    let save = document.querySelector("#save")
    save.addEventListener("click", function(){checkIfNumber(newTripDialog, input, true)})


    if(wrong == true){
        input.style.backgroundColor = "red";
    }
    
}
//ALEX - Kontrollerar ifall användaren skrivit in siffror i dialogen och kallar därefter på adekvat funktion 
function checkIfNumber(close, input, newBudget){
    close.close()

    let number = parseInt(input.value)

    if(isNaN(number)){
        console.log("hej")
        if(newBudget == true){
            newTripFunc(true)}
        if(newBudget == false){
            newSpendFunc(true)}
      
    }
    
    if(!isNaN(number)){
    
        if(newBudget == false){
            let nameElem = document.querySelector("#name")
            let name = nameElem.value
            
            let category;
            let options = document.querySelectorAll(".option");
            for (let a = 0; a<options.length; a++){
                if(options[a].checked){
                 category = options[a].getAttribute("id")
                }
            }

            spendings.push(new Spending(name, number, category))
    }
    
    
        if(newBudget == true){
            minBudget = number
            setBudget()
    }
}
    

}
//ALEX - Sätter budgeten
function setBudget (){
    let budgetElem = document.querySelector("#av")
    budgetElem.innerHTML = minBudget
}
//ALEX - Öppnar dialog för att användaren ska kunna fylla i en ny utgift
function newSpendFunc (wrong){
    let newSpendDialog = document.querySelector("#newSpendDialog")
    newSpendDialog.showModal()

    let input = document.querySelector("#amount")

    let save = document.querySelector("#close")
    save.addEventListener("click", function(){checkIfNumber(newSpendDialog, input, false)})


    if(wrong == true){
        input.style.backgroundColor = "red";
    }
}

function Spending(name, price, category){
    this.name = name;
    this.price = price;
    this.category = category;
    
    listSpednings
}

function listSpednings(){
    
}