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
         },
         {
            "id": "vegetariano",
            "name": "Hamburger vegetariano",
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
           "id": "lattuga",
           "name": "Lattuga",
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
         "hamburger",
         "formaggio",
         "cipolla",
         "anelli",
         "ketchup",
         "maionese"
       ],
       "price": "7.5"
     },
     {
       "name": "Borghese",
       "ingredients": [
         "hamburger",
         "formaggio",
         "peperoni",
         "cipolla",
         "zucchine",
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
         "lattuga",
         "pomodoro",
         "ketchup"
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
           "name": "CocaCola in lattina",
           "price": "1.5"
         },
         {
           "name": "Fanta in lattina",
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
           "price": "3"
         },
         {
            "name": "Anelli Cipolla",
            "price": "3"
         }
       ]
     }
   ]
 };

$(document).ready(function() {
    $("#danger-alert").hide();
});

function clearAllIngredients() {
   setBurgerTotalDivHTML(0);
   document.getElementById("Double").checked = false;
   config.ingredients.forEach((ingredientType)=>{
      ingredientType.list.forEach((ingredient)=>{
         uncheckBoxWithId(ingredient.id)
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

function isElementWithIdDisabled(id){
   return document.getElementById(id).disabled === true;
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
      if (!isElementWithIdDisabled(ingredient)){
         checkBoxWithId(ingredient);
      } else {
        $("#danger-alert").fadeTo(2000, 500).slideUp(1500, function() {
            $("#danger-alert").slideUp(500);
        });
        clearAllIngredients();
        uncheckBoxWithId(defaultBurger.name);
        exit;
      }
   });
   updateOrderTotal();
}

function defaultBurgerUnchecked() {
   clearAllIngredients();
   setBurgerTotalDivHTML("0");
   updateOrderTotal();
}

function doubleClicked() {
   basePrice = 0;
   if(isCheckboxWithIdActive("Double")){
      if(!isPrimarySelected()){
         document.getElementById("Double").checked = false;
         return
      }
      else{
         basePrice = 2;
      }
   }
   burgerPrice = basePrice + computeIngredientsPrice();
   getPaninoDivElement().innerHTML = `${burgerPrice} €`;
   updateOrderTotal()
}

function primaryClicked() {
   basePrice = 0;
   if(isCheckboxWithIdActive("Baby"))
      return;

   if(isCheckboxWithIdActive("Double")){
      basePrice = 2;
   }
   
   burgerPrice = basePrice + computeIngredientsPrice();
   getPaninoDivElement().innerHTML = `${burgerPrice} €`;
   updateOrderTotal();
}

function secondaryClicked(){
   basePrice = 0;
   if(!isPrimarySelected()){
      basePrice = 5;
   }

   if(isCheckboxWithIdActive("Baby")){
      document.getElementById("Baby").checked = false;
   }

   if(isCheckboxWithIdActive("Double")){
      basePrice = 2;
   }

   burgerPrice = basePrice + computeIngredientsPrice();
   getPaninoDivElement().innerHTML = `${burgerPrice} €`;
   updateOrderTotal()
}

function isPrimarySelected(){
   return config.ingredients.filter(ig=>ig.type=="Principale")[0].list.map(i=>isCheckboxWithIdActive(i.id)).reduce((acc, curr)=>acc || curr, false)
}

function isSecondarySelected(){
   return config.ingredients.filter(ig=>ig.type=="Farcitura")[0].list.map(i=>isCheckboxWithIdActive(i.id)).reduce((acc, curr)=>acc || curr, false)
}

function computeIngredientsPrice(){
   let price = 0;
   config.ingredients.forEach((ingredientType)=>{
      ingredientType.list.forEach((ingredient)=>{
         if(isCheckboxWithIdActive(ingredient.id))
            price += parseFloat(ingredient.price);
      })
   });
   return price;
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