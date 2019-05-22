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

function calculateBeveragesPrice(beverages) {
		let total = 0;
		if (!beverages) {
				return 0;
		}
		if (!Array.isArray(beverages)) {
				let actualBeverages = JSON.parse(beverages);
				return  actualBeverages.price;
		}else{
				beverages.forEach((beverage)=>{
						let actualBeverage = JSON.parse(beverage);
						total += Number.parseFloat(actualBeverage.price);
				});
		}
		return total;
}

function isStaffOrder(order){
	return !!(order.id == 0 && order.priority);
}

module.exports = {calculateBeveragesPrice, calculateBurgerPrice, isStaffOrder};