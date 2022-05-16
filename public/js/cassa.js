/**
 * div with id="prezzoBevande"
 * input with id="totaleBevande"
 * div with id="totale"
 * input with id="totalePanino"
 * div with id="prezzoPanino"*/

const config = {
   "days":[
     "2022-05-27", "2022-05-28", "2022-05-29", "2022-06-02", "2022-06-03", "2022-06-04", "2022-06-05"
   ],
 
   "ingredients":[
     {
       "type": "Principale",
       "list": [
         {
           "id": "hamburger",
           "name": "Hamburger",
           "price": "7"
         },
         {
           "id": "salsiccia",
           "name": "Salsiccia",
           "price": "7"
         }
       ]
     },
     {
       "type": "Farcitura",
       "list": [
         {
           "id": "formaggio",
           "name": "Formaggio",
           "price": "0"
         },
         {
           "id": "zucchine",
           "name": "Zucchine",
           "price": "0"
         },
         {
           "id": "peperoni",
           "name": "Peperoni",
           "price": "0"
         },
         {
           "id": "cipolla",
           "name": "Cipolla",
           "price": "0"
         },
         {
           "id": "insalata",
           "name": "Insalata",
           "price": "0"
         },
         {
           "id": "pomodoro",
           "name": "Pomodoro",
           "price": "0"
         },
         {
           "id": "anelli",
           "name": "Anelli di cipolla",
           "price": "0.50"
         }
       ]
     },
     {
       "type": "Salse",
       "list": [
         {
           "id": "ketchup",
           "name": "Ketchup",
           "price": "0"
         },
         {
           "id": "maionese",
           "name": "Maionese",
           "price": "0"
         },
         {
           "id": "bbq",
           "name": "BBQ",
           "price": "0"
         }
       ]
     }
   ],
   "defaultBurgers": [
     {
       "name": "Cannavacciuolo",
       "ingredients": [
         "salsiccia",
         "formaggio",
         "cipolla",
         "zucchine",
         "maionese"
       ],
       "price": "7"
     },
     {
       "name": "Borghese",
       "ingredients": [
         "hamburger",
         "formaggio",
         "peperoni",
         "bbq"
       ],
       "price": "7"
     },
     {
       "name": "Ramsay",
       "ingredients": [
         "hamburger",
         "Double",
         "formaggio",
         "cipolla",
         "insalata",
         "pomodoro",
         "ketchup",
         "maionese"
       ],
       "price": "9"
     },
     {
       "name": "Baby",
       "ingredients": [
         "hamburger"
       ],
       "price": "5"
     }
   ],
   "beverages": [
     {
       "type": "Birra Artigianale",
       "list": [
         {
           "name": "Rooibos Red Spina",
           "price": "4"
         },
         {
           "name": "Hooper IPA Spina",
           "price": "4"
         }
       ]
     },
     {
       "type": "Birra Normale",
       "list": [
         {
           "name": "Bionda Forst Spina",
           "price": "3"
         }
       ]
     },
     {
       "type": "Bevande analcoliche",
       "list": [
         {
           "name": "CocaCola",
           "price": "1.5"
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
           "name": "Percy Blonde Ale Bottiglia",
           "price": "4"
         },
         {
           "name": "Rooibos Red Ale Bottiglia",
           "price": "4.5"
         },
         {
           "name": "Hooper IPA Bottiglia",
           "price": "4.5"
         }
       ]
     }
   ],
   "extra": [
     {
       "type": "Fritto",
       "list": [
         {
           "name": "Patatine fritte",
           "price": "2.5"
         },
         {
            "name": "Anelli Cipolla",
            "price": "3"
         }
       ]
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

function getExtrasDivElement() {
   return document.getElementById('prezzoExtra');
}

function getTotaleDivElement(){
   return document.getElementById('totale');
}

function updateOrderTotal(){
   getTotaleDivElement().innerHTML = (parseFloat(getExtrasDivElement().innerHTML) + parseFloat(getBevandeDivElement().innerHTML) + parseFloat(getPaninoDivElement().innerHTML)).toString() + ' €';
}

function checkBoxWithId(id){
   document.getElementById(id).checked = true;
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
   if (!isCheckboxWithIdActive(beverage.name)){
      return 0;
   }
   return parseFloat(beverage.price) * parseFloat(getBeverageQuantityElement(beverage).value)
}


function extraClicked(extra) {
   if (isCheckboxWithIdActive(extra.name)){
      extraChecked(extra);
   }else{
      extraUnchecked(extra);
   }
}

function extraChecked(extra) {
   getExtraQuantityElement(extra).value = 1;
   updateExtrasTotal();
   updateOrderTotal();
}

function extraUnchecked(extra){
   getExtraQuantityElement(extra).value = '';
   updateExtrasTotal();
   updateOrderTotal();
}

function updateExtrasTotal() {
   let totalExtraPrice = 0;
   config.extra.forEach(extraType=>{
      extraType.list.forEach(extra=>{
         totalExtraPrice += totalExtraValue(extra);
      })
   });
   getExtrasDivElement().innerHTML = `${totalExtraPrice} €`;
}

function getExtraQuantityElement(extra) {
   return document.getElementById(`${extra.name}-quantity`)
}

function extraQuantityChanged(extra) {
   checkBoxWithId(extra.name);
   updateExtrasTotal();
   updateOrderTotal();
}

function totalExtraValue(extra) {
   if (!isCheckboxWithIdActive(extra.name)){
      return 0;
   }
   return parseFloat(extra.price) * parseFloat(getExtraQuantityElement(extra).value)
}