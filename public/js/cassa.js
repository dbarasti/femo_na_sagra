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

function clearAll() {
   getPaninoDivElement().innerHTML = "0 EURO";
   document.getElementById("double").checked = false;
   document.getElementById("carne1").checked = false;
   document.getElementById("carne2").checked = false;
   document.getElementById("verdura1").checked = false;
   document.getElementById("verdura2").checked = false;
   document.getElementById("verdura3").checked = false;
   document.getElementById("verdura4").checked = false;
   document.getElementById("verdura5").checked = false;
   document.getElementById("verdura6").checked = false;
   document.getElementById("verdura7").checked = false;
   document.getElementById("salsa1").checked = false;  
   document.getElementById("salsa2").checked = false;  
   document.getElementById("salsa3").checked = false;  
   document.getElementById("salsa4").checked = false;         
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
   return document.getElementById(id).checked == true;
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
   checkBoxWithId("carne1");
   checkBoxWithId("verdura1");
   checkBoxWithId("verdura5");
   checkBoxWithId("verdura3");
   checkBoxWithId("verdura2");
   checkBoxWithId("salsa4");
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
   checkBoxWithId("carne2");
   checkBoxWithId("verdura1");
   checkBoxWithId("verdura3");
   checkBoxWithId("verdura4");
   checkBoxWithId("salsa3");
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
   checkBoxWithId("carne2");
   checkBoxWithId("double");
   checkBoxWithId("verdura1");
   checkBoxWithId("verdura5");
   checkBoxWithId("verdura6");
   checkBoxWithId("verdura7");
   checkBoxWithId("salsa1");
   checkBoxWithId("salsa2");
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
   checkBoxWithId("carne2");
   updateTotal();
}
function babyUnchecked() {
   clearAll();
   getPaninoInputElement().value = "0";
   updateTotal();
}

function doubleClicked() {
   if(isCheckboxWithIdActive("double")){
      if(!isCheckboxWithIdActive("carne1") && !isCheckboxWithIdActive("carne2")){
         document.getElementById("double").checked = false;
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
   if(isCheckboxWithIdActive("baby"))
      return;
   if(isCheckboxWithIdActive("double")){
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
   if(!isCheckboxWithIdActive("carne1") && !isCheckboxWithIdActive("carne2"))
      if(parseFloat(getPaninoDivElement().innerHTML) == 5)
         return;
      else{
         getPaninoDivElement().innerHTML = "5 EURO";
         getPaninoInputElement().value = "5";
         updateTotal()
      }
   else{
      if(isCheckboxWithIdActive("baby")){
         document.getElementById("baby").checked = false;
         getPaninoDivElement().innerHTML = "7 EURO";
         getPaninoInputElement().value = "7";
         updateTotal()
      }
   }
      
}

/*
* bevande checkbox clicked*/
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
      //aggiornamento totale bevande
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
