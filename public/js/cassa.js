/**
 * div with id="prezzoBevande"
 * input with id="totaleBevande"
 * div with id="totale"
 * input with id="totalePanino"
 * div with id="prezzoPanino"*/

const config = {
   "days":[
     "2023-05-13", "2023-05-26", "2023-05-27", "2023-05-28", "2023-06-01", "2023-06-02", "2023-06-03", "2023-06-04"
   ],
 
   "options": {
     "print": false
   },
 
   "ingredients":[
     {
       "type": "Principale",
       "list": [
         {
           "id": "hamburger",
           "name": "Hamburger",
           "price": "8"
         },
          {
             "id": "vegetariano",
             "name": "Hamburger vegetariano",
             "price": "8"
          }
       ]
     },
     {
       "type": "Farcitura",
       "list": [
         {
           "id": "cheddar",
           "name": "Cheddar",
           "price": "0"
         },
         {
           "id": "bacon",
           "name": "Bacon",
           "price": "0.50"
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
       "name": "Classico",
       "ingredients": [
         "hamburger",
         "cheddar",
         "lattuga",
         "pomodoro",
         "ketchup",
         "maionese"
       ],
       "price": "8"
     },
     {
       "name": "BBQ Burger",
       "ingredients": [
         "hamburger",
         "cheddar",
         "bacon",
         "cipolla",
         "bbq"
       ],
       "price": "8.5"
     },
     {
       "name": "Sgionfo",
       "ingredients": [
         "hamburger",
         "Double",
         "cheddar",
         "anelli",
         "lattuga",
         "maionese"
       ],
       "price": "10"
     },
     {
       "name": "Plant-based",
       "ingredients": [
         "vegetariano",
         "anelli",
         "zucchine",
         "pomodoro",
         "ketchup"
       ],
       "price": "8.5"
     }
   ],
   "beverages": [
     {
       "type": "Birra",
       "list": [
         {
           "name": "12°",
           "price": "4.5"
         },
         {
           "name": "Brauch",
           "price": "4.5"
         },
         {
           "name": "BirrettIPA",
           "price": "4.5"
         }
       ]
     },
     {
       "type": "Bevande analcoliche",
       "list": [
         {
           "name": "CocaCola alla spina",
           "price": "3"
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

function printOrder(){
   let orderId = document.getElementById('id').value;
   let print = window.open('../html/print_order.html', "Stampa Ordine", "popup=1,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
   // current time in short readable format
   let time = new Date();
   time = time.toLocaleTimeString();
   print.document.writeln(`<h1>Ordine ${orderId}</h1>`);
   print.document.writeln(`<h3>Ora ordinazione: ${time}</h3>`);
   print.document.writeln(`<div style="line-height:4px; margin-left:60px">`);
   config.ingredients.forEach((ingredientType)=>{
      print.document.writeln(`<h3>${ingredientType.type}</h3>`);
      
       ingredientType.list.forEach((ingredient)=>{
         if(document.getElementById(ingredient.id).checked){
            if(ingredientType.type === "Principale" && document.getElementById("Double").checked){
               print.document.writeln(`<p><b>Double</b> ${ingredient.name}</p>`);
            }else{
               print.document.writeln(`<p>${ingredient.name}</p>`);
            }
         }
      })
   });
   print.document.writeln(`</div>`);
   print.window.print();
   print.window.close();
}

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
         basePrice = 1.5;
      }
   }
   burgerPrice = basePrice + computeIngredientsPrice();
   getPaninoDivElement().innerHTML = `${burgerPrice} €`;
   updateOrderTotal()
}

function primaryClicked() {
   basePrice = 0;
   if(isCheckboxWithIdActive("Double")){
      basePrice = 1.5;
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

   if(isCheckboxWithIdActive("Double")){
      basePrice = 1.5;
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