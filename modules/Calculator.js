let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


function calculateBurgerPrice(order) {
    basePrice = 0
    
    if(!order.Principale && !order.Farcitura && !order.Salse){
            return 0;
    }

    if (order.Principale && order.double){
        basePrice = 2;
    }
    if (order.Principale && !order.double){
        if (!order.Farcitura) {
                return 5;
        }
    }
    if (!order.Principale && order.Farcitura){
        basePrice = 5;
    }
    return basePrice + computeIngredientsPrice(order);
}

function computeIngredientsPrice(order) {
    let price = 0;
    config.ingredients.forEach((ingredientType)=>{
        ingredientType.list.forEach((ingredient)=>{
            if((order.Principale && order.Principale === ingredient.name) || (order.Farcitura && order.Farcitura.includes(ingredient.name)) || (order.Salse && order.Salse.includes(ingredient.name))){ 
                price += parseFloat(ingredient.price);
            }
        })
    });
    return price;
}

function calculateBeveragesPrice(order) {
	if (!order.beverages) {
		return 0;
	}
	let total = 0;
	let beveragesIndex = 0;

	order.beveragesQuantities.forEach(quantity=>{
	    if (quantity != ''){
	        if (Array.isArray(order.beverages)) {
                total += quantity * JSON.parse(order.beverages[beveragesIndex]).price;
                beveragesIndex++;
            }else{
                total += quantity * JSON.parse(order.beverages).price;
            }
        }
    });
	return total;
}

function calculateExtrasPrice(order) {
    if (!order.extras) {
        return 0;
    }
    let total = 0;

    if (Array.isArray(order.extrasQuantities)){
        let extrasIndex = 0;
        order.extrasQuantities.forEach(quantity=>{
            if (quantity != ''){
                if (Array.isArray(order.extras)) {
                    total += quantity * JSON.parse(order.extras[extrasIndex]).price;
                    extrasIndex++;
                }else{
                    total += quantity * JSON.parse(order.extras).price;
                }
            }
        });
    }else{
        total = parseInt(order.extrasQuantities) * JSON.parse(order.extras).price;
    }
    return total;
}


function isStaffOrder(order){
	return order.staff != undefined;
}

function isPriorityOrder(order){
	return order.priority != undefined;
}

module.exports = {calculateExtrasPrice, calculateBeveragesPrice, calculateBurgerPrice, isStaffOrder, isPriorityOrder};
