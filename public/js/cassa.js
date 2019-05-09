/**
 * div with id="prezzoBevande"
 * input with id="totaleBevande"
 * div with id="totale"
 * input with id="totalePanino"
 * div with id="prezzoPanino"*/

const PANINO_CANNAVACCIUOLO = "cannavacciuolo";
const PANINO_BORGHESE = "borghese";
const PANINO_RAMSEY = "ramsey";
const PANINO_BABY = "baby";
const config = {
   "ingredients":[
      {
         "primary":[
            "Hamburger",
            "Salsiccia"
         ],
         "secondary":[
            "Formaggio",
            "Zucchine",
            "Peperoni",
            "Melanzane",
            "Cipolla",
            "Insalata",
            "Pomodoro"
         ],
         "sauces":[
            "Ketchup",
            "Senape",
            "Maionese",
            "BBQ"
         ]
      }
   ],
   "burgers": [
      {
         "Cannavacciuolo": [
            "Salsiccia","Formaggio", "Cipolla", "Peperoni", "Zucchine", "Senape"
         ],
         "Borghese": [
            "Hamburger","Formaggio", "Peperoni", "Melanzane", "BBQ"
         ],
         "Ramsey": [
            "Hamburger", "Double", "Formaggio", "Cipolla", "Insalata", "Pomodoro", "Ketchup", "Maionese"
         ]
      }
   ],
   "beverages": [
      {
         "beers": [
            {
               "microbrew": [
                  "Bianca Artigianale", "Rossa Artigianale"
               ],
               "barrel": [
                  "Bionda Forst"
               ]
            }
         ],
         "no_alcohol": [
            "CocaCola", "Acqua Naturale", "Acqua Frizzante"
         ]
      }
   ]
};



function clearAll() {
   getPaninoDivElement().innerHTML = "0 EURO";
   document.getElementById("Double").checked = false;
   config.ingredients[0].primary.forEach((ingredient)=>{
      document.getElementById(ingredient).checked = false;
   });
   config.ingredients[0].secondary.forEach((ingredient)=>{
      document.getElementById(ingredient).checked = false;
   });
   config.ingredients[0].sauces.forEach((ingredient)=>{
      document.getElementById(ingredient).checked = false;
   });
}

function getBevandeInputElement(){
   return document.getElementById('totaleBevande');
}
function getBevandeDivElement(){
   return document.getElementById('prezzoBevande');
}

function getPaninoInputElement(){
   return document.getElementById('totalePanino');
}

function getPaninoDivElement(){
   return document.getElementById('prezzoPanino');
}

function getTotaleDivElement(){
   return document.getElementById('totale');
}

function updateTotal(){
   getTotaleDivElement().innerHTML = (parseFloat(getBevandeInputElement().value) + parseFloat(getPaninoInputElement().value)).toString() + ' EURO';
}

function checkBoxWithId(id){
   document.getElementById(id).checked = true;
}

function isCheckboxWithIdActive(id){
   return document.getElementById(id).checked === true;
}

function cannavacciuoloClicked() {
   if(isCheckboxWithIdActive(PANINO_CANNAVACCIUOLO))
      cannavacciuoloChecked();
   else
      cannavacciuoloUnchecked();
}

function cannavacciuoloChecked(){
   clearAll();
   getPaninoDivElement().innerHTML = "7 EURO";
   getPaninoInputElement().value = "7";
   config.burgers[0].Cannavacciuolo.forEach((ingredient)=>{
      checkBoxWithId(ingredient);
   });
   updateTotal();
}

function cannavacciuoloUnchecked(){
   clearAll();
   getPaninoInputElement().value = "0";
   updateTotal();
}

function borgheseClicked() {
   if(isCheckboxWithIdActive(PANINO_BORGHESE))
      borgheseChecked();
   else
      borgheseUnchecked();
}
function borgheseChecked(){
   clearAll();
   getPaninoDivElement().innerHTML = "7 EURO";
   getPaninoInputElement().value = "7";
   config.burgers[0].Borghese.forEach((ingredient)=>{
      checkBoxWithId(ingredient);
   });
   updateTotal();
}

function borgheseUnchecked(){
   clearAll();
   getPaninoInputElement().value = "0";
   updateTotal();
}

function ramseyClicked() {
   if(isCheckboxWithIdActive(PANINO_RAMSEY))
      ramseyChecked();
   else
      ramseyUnchecked();
}
function ramseyChecked(){
   clearAll();
   getPaninoDivElement().innerHTML = "9 EURO";
   getPaninoInputElement().value = "9";
   config.burgers[0].Ramsey.forEach((ingredient)=>{
      checkBoxWithId(ingredient);
   });
   updateTotal();
}

function ramseyUnchecked(){
   clearAll();
   getPaninoInputElement().value = "0";
   updateTotal();
}

function babyClicked() {
   if(isCheckboxWithIdActive(PANINO_BABY))
      babyChecked();
   else
      babyUnchecked();
}
function babyChecked() {
   clearAll();
   getPaninoDivElement().innerHTML = "5 EURO";
   getPaninoInputElement().value = "5";
   checkBoxWithId("Hamburger");
   updateTotal();
}
function babyUnchecked() {
   clearAll();
   getPaninoInputElement().value = "0";
   updateTotal();
}

function doubleClicked() {
   if(isCheckboxWithIdActive("Double")){
      if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia")){
         document.getElementById("Double").checked = false;
      }
      else{
         getPaninoDivElement().innerHTML = "9 EURO";
         getPaninoInputElement().value = "9";
         updateTotal()
      }

   }
   else{
      getPaninoDivElement().innerHTML = "7 EURO";
      getPaninoInputElement().value = "7";
      updateTotal();
   }
}

function carneClicked() {
   if(isCheckboxWithIdActive(PANINO_BABY))
      return;
   if(isCheckboxWithIdActive("Double")){
      getPaninoDivElement().innerHTML = "9 EURO";
      getPaninoInputElement().value = "9";
      updateTotal()
   }
   else{
      getPaninoDivElement().innerHTML = "7 EURO";
      getPaninoInputElement().value = "7";
      updateTotal()
   }
}

function farcituraClicked(){
   if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia"))
      if(parseFloat(getPaninoDivElement().innerHTML) === 5)
         return;
      else{
         getPaninoDivElement().innerHTML = "5 EURO";
         getPaninoInputElement().value = "5";
         updateTotal()
      }
   else{
      if(isCheckboxWithIdActive(PANINO_BABY)){
         document.getElementById(PANINO_BABY).checked = false;
         getPaninoDivElement().innerHTML = "7 EURO";
         getPaninoInputElement().value = "7";
         updateTotal()
      }
   }
      
}

/*
* beveragesStats checkbox clicked*/
function bevandaClicked(bevanda, prezzo) {

   //controllo se il checkbox è stato selezionato
   if(isCheckboxWithIdActive(bevanda)){
      let currentBevandaTotal = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      let updatedBevandeTotal = currentBevandaTotal + prezzo;
      getBevandeDivElement().innerHTML = updatedBevandeTotal.toString() + ' EURO';
      getBevandeInputElement().value = updatedBevandeTotal;
      updateTotal();
      document.getElementById("dropdown"+bevanda.charAt(bevanda.length-1)).innerHTML =  "1"; //setto il testo del dropdown menù
      document.getElementById(bevanda+"1").classList.toggle('disabled'); //bevanda+"1" indica il primo elemento del dropdown della bevanda
      
      //metto in coda a bevanda la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda).value = 1;  


   }
   else{
      //calcolo valore da sottrarre
      let quantita = parseInt(document.getElementById("dropdown"+bevanda.charAt(bevanda.length-1)).innerHTML);
      //aggiornamento totale beveragesStats
      let value = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      value = value - prezzo*quantita;
      getBevandeDivElement().innerHTML = value.toString() + ' EURO';
      getBevandeInputElement().value = value;
      updateTotal();
      //riabilito la entry
      let dropdown = "dropdown" + bevanda.charAt(bevanda.length-1);
      document.getElementById(bevanda+document.getElementById(dropdown).innerHTML).classList.toggle('disabled');
      //aggiorno drop menu
      document.getElementById('dropdown'+bevanda.charAt( bevanda.length-1)).innerHTML = 0;
   }
}


function dropClicked(dropdown, bevanda, prezzo) {
 
   let quantita = bevanda.charAt(dropdown.length-1);  //ultimo carattere di bevanda
   if(isCheckboxWithIdActive("bevanda"+bevanda.charAt(dropdown.length-2))){
      let quantita_old = parseInt(document.getElementById(dropdown).innerHTML);
      let dropNum = dropdown.charAt(dropdown.length-1);
      //disabilito entry selezionata
      document.getElementById(bevanda).classList.toggle('disabled');
      //riabilito la entry selezionata precedentemente
      document.getElementById("bevanda"+dropNum+quantita_old.toString()).classList.toggle('disabled');
      //aggiorno testo del dropdown menu
      document.getElementById(dropdown).innerHTML = quantita;
      let valore_old = quantita_old*prezzo;
      let diff = quantita*prezzo - valore_old;
      let value = parseFloat(getBevandeDivElement().innerHTML);
      value = value + diff;
      getBevandeDivElement().innerHTML = value.toString() + ' EURO';
      getBevandeInputElement().value = value;
      updateTotal();
      //metto in coda a bevanda la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda.slice(0,-1)).value = quantita;
   }
   else{
      document.getElementById("bevanda"+bevanda.charAt(dropdown.length-2)).checked = true;
      document.getElementById(dropdown).innerHTML = quantita;
      //disabilito la entry selezionata
      document.getElementById(bevanda).classList.toggle('disabled');

      let value = parseFloat(getBevandeDivElement().innerHTML);
      value = value + prezzo*quantita;
      getBevandeDivElement().innerHTML = value.toString() + ' EURO';
      getBevandeInputElement().value = value;
      updateTotal();
      //metto nel valore di 'bevanda' la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda.slice(0,-1)).value = quantita;  
   }
}
