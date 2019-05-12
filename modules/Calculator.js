let fs = require('fs');
let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

function calculateBurgerPrice(order) {
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
		let total = 0;
		order.beverages.forEach((beverage)=>{
				total += beverage.price;
		});
		return total;
}


module.exports = {calculateBeveragesPrice, calculateBurgerPrice};