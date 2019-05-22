/**
 * div with id="prezzoBevande"
 * input with id="totaleBevande"
 * div with id="totale"
 * input with id="totalePanino"
 * div with id="prezzoPanino"*/

const config = {
       "ingredients":[
          {
             "type": "Principale",
             "list": [
                "Hamburger",
                "Salsiccia"
             ]
          },
          {
             "type": "Farcitura",
             "list": [
                "Formaggio",
                "Zucchine",
                "Peperoni",
                "Melanzane",
                "Cipolla",
                "Insalata",
                "Pomodoro"
             ]
          },
          {
             "type": "Salse",
             "list": [
                "Ketchup",
                "Senape",
                "Maionese",
                "BBQ"
             ]
          }
       ],
       "defaultBurgers": [
          {
             "name": "Cannavacciuolo",
             "ingredients": [
                "Salsiccia",
                "Formaggio",
                "Cipolla",
                "Peperoni",
                "Zucchine",
                "Senape"
             ],
             "price": "7"
          },
          {
             "name": "Borghese",
             "ingredients": [
                "Hamburger",
                "Formaggio",
                "Peperoni",
                "Melanzane",
                "BBQ"
             ],
             "price": "7"
          },
          {
             "name": "Ramsey",
             "ingredients": [
                "Hamburger",
                "Double",
                "Formaggio",
                "Cipolla",
                "Insalata",
                "Pomodoro",
                "Ketchup",
                "Maionese"
             ],
             "price": "9"
          },
          {
             "name": "Baby",
             "ingredients": [
                "Hamburger"
             ],
             "price": "5"
          }
       ],
       "beverages": [
          {
             "type": "Birra Artigianale",
             "list": [
                {
                   "name": "Bianca Artigianale",
                   "price": "3.5"
                },
                {
                   "name": "Rossa Artigianale",
                   "price": "3.5"
                }
             ]
          },
          {
             "type": "Birra Normale",
             "list": [
                {
                   "name": "Bionda Forst",
                   "price": "3"
                }
             ]
          },
          {
             "type": "Bevande analcoliche",
             "list": [
                {
                   "name": "CocaCola",
                   "price": "2.5"
                },
                {
                   "name": "Acqua Naturale",
                   "price": "1"
                },
                {
                   "name": "Acqua Frizzante",
                   "price": "1"
                }
             ]
          }
       ],
       "extra": [
          {
             "name": "Patatine fritte",
             "price": "2.5"
          }
       ]
    };



function clearAllIngredients() {
   setBurgerTotalDivHTML(0);
   document.getElementById("Double").checked = false;
   config.ingredients.forEach((ingredientType)=>{
      ingredientType.list.forEach((ingredient)=>{
         uncheckBoxWithId(ingredient)
      })
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
   getTotaleDivElement().innerHTML = (parseFloat(getBevandeDivElement().innerHTML) + parseFloat(getPaninoDivElement().innerHTML)).toString() + ' €';
}

function checkBoxWithId(id){
   document.getElementById(id).checked = true;
   console.log(document.getElementById(id).checked);
}

function uncheckBoxWithId(id){
   document.getElementById(id).checked = false;
}

function invertBoxWithId(id) {
   document.getElementById(id).checked = !document.getElementById(id).checked;
}

function isCheckboxWithIdActive(id){
   return document.getElementById(id).checked === true;
}

function setBurgerTotalDivHTML(value) {
   getPaninoDivElement().innerHTML = value + " €";
}

function clearDefaultBurgersExcept(burgerName) {
   config.defaultBurgers.filter((burger)=>burger.name!==burgerName)
       .forEach((burger)=>{
          uncheckBoxWithId(burger.name);
       })
}


function defaultBurgerClicked(defaultBurger) {
   if(isCheckboxWithIdActive(defaultBurger.name))
      defaultBurgerChecked(defaultBurger);
   else
      defaultBurgerUnchecked();
}

function defaultBurgerChecked(defaultBurger) {
   clearAllIngredients();
   clearDefaultBurgersExcept(defaultBurger.name);
   setBurgerTotalDivHTML(defaultBurger.price);
   defaultBurger.ingredients.forEach((ingredient)=>{
      console.log(ingredient);
      checkBoxWithId(ingredient);
   });
   updateTotal();
}

function defaultBurgerUnchecked() {
   clearAllIngredients();
   setBurgerTotalDivHTML("0");
   updateTotal();
}


function doubleClicked() {
   if(isCheckboxWithIdActive("Double")){
      if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia")){
         document.getElementById("Double").checked = false;
      }
      else{
         getPaninoDivElement().innerHTML = "9 €";
         updateTotal()
      }
   }  else{
      getPaninoDivElement().innerHTML = "7 €";
      updateTotal();
   }
}

function primaryClicked() {
   if(isCheckboxWithIdActive("Baby"))
      return;
   if(isCheckboxWithIdActive("Double")){
      getPaninoDivElement().innerHTML = "9 €";
      updateTotal()
   }
   else{
      getPaninoDivElement().innerHTML = "7 €";
      updateTotal()
   }
}

function secondaryClicked(){
   if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia"))
      if(parseFloat(getPaninoDivElement().innerHTML) === 5)
         return;
      else{
         getPaninoDivElement().innerHTML = "5 €";
         updateTotal()
      }
   else{
      if(isCheckboxWithIdActive("Baby")){
         document.getElementById("Baby").checked = false;
         getPaninoDivElement().innerHTML = "7 €";
         updateTotal()
      }
   }
}

function beverageClicked(beverage) {
   if (isCheckboxWithIdActive(beverage.name)){
      beverageChecked(beverage);
   }else{
      beverageUnchecked(beverage);
   }
}

function beverageChecked(beverage) {
   getBevandeDivElement().innerHTML = (parseFloat(getBevandeDivElement().innerHTML) + parseFloat(beverage.price)).toString() + ' €';
   updateTotal();
}

function beverageUnchecked(beverage){
   getBevandeDivElement().innerHTML = (parseFloat(getBevandeDivElement().innerHTML) - parseFloat(beverage.price)).toString() + ' €';
   updateTotal();
}

/* beveragesStats checkbox clicked*/
function bevandaClicked(bevanda, prezzo) {

   //controllo se il checkbox è stato selezionato
   if(isCheckboxWithIdActive(bevanda)){
      let currentBevandaTotal = parseFloat(document.getElementById('prezzoBevande').innerHTML);
      let updatedBevandeTotal = currentBevandaTotal + prezzo;
      getBevandeDivElement().innerHTML = updatedBevandeTotal.toString() + ' €';
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
      getBevandeDivElement().innerHTML = value.toString() + ' €';
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
      getBevandeDivElement().innerHTML = value.toString() + ' €';
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
      getBevandeDivElement().innerHTML = value.toString() + ' €';
      getBevandeInputElement().value = value;
      updateTotal();
      //metto nel valore di 'bevanda' la quantità selezionata (O ALMENO CI PROVO)
      document.getElementById(bevanda.slice(0,-1)).value = quantita;  
   }
}
