let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

function calculateBurgerPrice(order) {
    if(!order.Principale && !order.Farcitura && !order.Salse){
            return 0;
    }

    if (order.Principale && order.double){
        return 9;
    }
    if (order.Principale && !order.double){
        if (order.Farcitura) {
                return 7;
        }
        else {
                return 5;
        }
    }else{
        return 5
    }
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

function isStaffOrder(order){
	return !!(order.id == 0 && order.priority);
}

function isPriorityOrder(order){
	return order.priority != undefined;
}

module.exports = {calculateBeveragesPrice, calculateBurgerPrice, isStaffOrder, isPriorityOrder};