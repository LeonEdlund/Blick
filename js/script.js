let dialog;
let uDialog;
let nyResa;
let nyUtgift;
let minBudget;
let utgifter=[];
let input;
let uInput;


function init(){
    dialog = document.querySelector("#dialog")
    uDialog = document.querySelector("#uDialog")
    input = document.querySelector("#minBudget")
    uInput = document.querySelector("#utgift")
    nyResa = document.querySelector("#nyResa")
    nyResa.addEventListener("click",function(){ openDialog(dialog)})
    nyUtgift = document.querySelector("#nyUtgift")
    nyUtgift.addEventListener("click", function(){openDialog(uDialog)})
    
    


}
window.addEventListener("load", init)

function openDialog(id){
    console.log(id)
    id.showModal()
    let close = document.querySelectorAll(".close")
    for(let a = 0; a < close.length; a++)
    close[a].addEventListener("click",function(){ closeDialog(id)})
    
}


function closeDialog(id){
    id.close()
    minBudget = parseInt(input.value)
    let newValue = parseInt(uInput.value)
    utgifter.push(newValue)
    console.log(utgifter)
    setBudget()
    
}

function setBudget(){
    let av = document.querySelector("#av")
    av.innerHTML = minBudget
    let utgift = document.querySelector("#utgifter")
    utgifter.innerHTML = ""
    for(let b=0;b < utgifter.length; b++){
    utgift.innerHTML += "<li class = 'utgift'>" +utgifter[b]+"</li>"
    }
}

