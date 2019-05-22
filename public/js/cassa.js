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
                   "name": "Notte Bianca alla spina",
                   "price": "3.5"
                },
                {
                   "name": "Rossa Intigante alla spina",
                   "price": "3.5"
                }
             ]
          },
          {
             "type": "Birra Normale",
             "list": [
                {
                   "name": "Bionda Forst alla spina",
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
          },
          {
             "type": "Vetro",
             "list": [
                {
                   "name": "New England Bottiglia",
                   "price": "5"
                },
                {
                   "name": "Notte Bianca Bottiglia",
                   "price": "5"
                },
                {
                   "name": "Rossa Intrigante Bottiglia",
                   "price": "5"
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

function getBevandeDivElement(){
   return document.getElementById('prezzoBevande');
}

function getPaninoDivElement(){
   return document.getElementById('prezzoPanino');
}

function getTotaleDivElement(){
   return document.getElementById('totale');
}

function updateOrderTotal(){
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
   updateOrderTotal();
}

function defaultBurgerUnchecked() {
   clearAllIngredients();
   setBurgerTotalDivHTML("0");
   updateOrderTotal();
}


function doubleClicked() {
   if(isCheckboxWithIdActive("Double")){
      if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia")){
         document.getElementById("Double").checked = false;
      }
      else{
         getPaninoDivElement().innerHTML = "9 €";
         updateOrderTotal()
      }
   }  else{
      getPaninoDivElement().innerHTML = "7 €";
      updateOrderTotal();
   }
}

function primaryClicked() {
   if(isCheckboxWithIdActive("Baby"))
      return;
   if(isCheckboxWithIdActive("Double")){
      getPaninoDivElement().innerHTML = "9 €";
      updateOrderTotal()
   }
   else{
      getPaninoDivElement().innerHTML = "7 €";
      updateOrderTotal()
   }
}

function secondaryClicked(){
   if(!isCheckboxWithIdActive("Hamburger") && !isCheckboxWithIdActive("Salsiccia"))
      if(parseFloat(getPaninoDivElement().innerHTML) === 5)
         return;
      else{
         getPaninoDivElement().innerHTML = "5 €";
         updateOrderTotal()
      }
   else{
      if(isCheckboxWithIdActive("Baby")){
         document.getElementById("Baby").checked = false;
         getPaninoDivElement().innerHTML = "7 €";
         updateOrderTotal()
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
   getBeverageQuantityElement(beverage).value = 1;
   updateBeveragesTotal();
   updateOrderTotal();
}

function beverageUnchecked(beverage){
   getBeverageQuantityElement(beverage).value = '';
   updateBeveragesTotal();
   updateOrderTotal();
}

function getBeverageQuantityElement(beverage) {
   return document.getElementById(`${beverage.name}-quantity`)
}

function beverageQuantityChanged(beverage) {
   checkBoxWithId(beverage.name);
   updateBeveragesTotal();
   updateOrderTotal();
}

function updateBeveragesTotal() {
   let totalBeveragesPrice = 0;
   config.beverages.forEach(beverageType=>{
      beverageType.list.forEach(beverage=>{
         totalBeveragesPrice += totalBeverageValue(beverage);
      })
   });
   getBevandeDivElement().innerHTML = `${totalBeveragesPrice} €`;
}


function totalBeverageValue(beverage) {
   console.log(beverage);
   if (!isCheckboxWithIdActive(beverage.name)){
      return 0;
   }
   return parseFloat(beverage.price) * parseFloat(getBeverageQuantityElement(beverage).value)
}