function getUnits(str)
{
	if (str.toLowerCase().indexOf('kg') !== -1){
		return "kg";
	}
	else if (str.toLowerCase().indexOf('g') !== -1){
		return "g";
	}
	else if (str.toLowerCase().indexOf('ml') !== -1){
		return "ml";
	}
	else if (str.toLowerCase().indexOf('l') !== -1){
		return "l";
	}
	else if (str.toLowerCase().indexOf('per pack') !== -1){
		return "per pack";
	}
}

function getOfferPricePerItem(str, price){
	// input the offer string
	// output the price per item
	var quantity = 1;
	var strList = str.split(" ");
	
	// Check if offer string has exactly four words. Otherwise exit function.
	if (strList.length !== 4){
		return (price/quantity)
	}
	
	// checks for legitimate numbers, prices, and percentages.
	if ((!isNaN(Number(strList[1]))) & (strList[3].indexOf("$") !== -1 | strList[3].indexOf("%") !== -1)){
		var quantity = strList[1];
		
		if (strList[2].toLowerCase().indexOf('for') !== -1){
			price = strList[3].replace("$", "");
		}
		else if (strList[2].toLowerCase().indexOf('save') !== -1){
			if (strList[3].indexOf("$") !== -1){
				price = (price * quantity) - strList[3].replace("$", "");
			}
			else if (strList[3].indexOf("%") !== -1){
				price = price * quantity * (100 - strList[3].replace("%", ""))/100;
			}
		}
	}
	return (price/quantity);
}

function addPrice(product)
{
    var description = product.getElementsByClassName('description')[0];
	
	if (description.textContent.indexOf(" / ") > -1){    // if unitprice already exists 
		console.log("unit price already exists");
		return;
	};
	
    var priceSpan = product.querySelector('[itemprop=price]').textContent;
    var price = priceSpan.replace("$", "");
	
	// Check for offers
	var offers = product.getElementsByClassName('ProductItemBadge__container___286yx');
	if (offers.length !== 0){
		var offerStr = offers[0].textContent;
	}
	else {
		var offerStr = ""
	}
	var offerPrice = getOfferPricePerItem(offerStr, price);
	// =====
	
    var sizeSpan = product.getElementsByClassName('size')[0].textContent;
	var sizeSpanUnit = getUnits(sizeSpan);
	
	// Handles "4 x 50g" formats
    if (sizeSpan.indexOf('x') > -1) {
        var total = 1;
        for (var i = 0; i < sizeSpan.split(' x ').length; i++) {
            elem = sizeSpan.split(' x ')[i];
			elemUnit = getUnits(elem);
			elem = elem.replace(" " + elemUnit, "");
			total *= elem;
        }
    } else {
        var total = sizeSpan.replace(" " + sizeSpanUnit, "");
    }
	
	var unitPrice = price/total;
	var unitOfferPrice = offerPrice/total;
	
	// Final touches: Turn ml to l, g to kg, per pack into pack, capitalise litres.
	if (sizeSpanUnit == "ml"){
		unitPrice *= 1000;
		unitOfferPrice *= 1000;		
		sizeSpanUnit = "L";
	}
	else if (sizeSpanUnit == "g"){
		unitPrice *= 1000; 
		unitOfferPrice *= 1000;
		sizeSpanUnit = "kg";
	}
	else if (sizeSpanUnit == "per pack"){
		sizeSpanUnit = "item";
	}
	else if (sizeSpanUnit == 'l'){
		sizeSpanUnit = "L";
	}

	// Check if unit price is too low, multiply by 100 if necessary.
	if (unitPrice <= 0.05 | unitOfferPrice <= 0.05){
		unitPrice *= 100;
		unitOfferPrice *= 100;
		if (sizeSpanUnit == "item"){
			sizeSpanUnit = "items";
		}
		sizeSpanUnit = "100 " + sizeSpanUnit
	}

	// Create the display string
	if (price != offerPrice){
		var outstr = "$"+ unitOfferPrice.toFixed(2) + " / " + sizeSpanUnit + " (offer)";
	}
	else {
		var outstr = "$"+ unitPrice.toFixed(2) + " / " + sizeSpanUnit;
	}

   	description.innerHTML += outstr;
}

chrome.runtime.sendMessage({}, function(response) {
	setTimeout(function () {
		if (document.getElementsByClassName("productShelf")) {
            var productShelves = document.getElementsByClassName("productShelf");
            for (var j=0; j < productShelves.length; j++){
            	var productShelf = productShelves[j];
               	var products = productShelf.querySelectorAll('li');
               	for (var i = 0; i < products.length; i++) {
                   	addPrice(products[i]);}
               };
        }
    }, 500);
});
/* chrome.runtime.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        setTimeout(function () {
            if (document.getElementsByClassName("productShelf")) {
                var productShelves = document.getElementsByClassName("productShelf");
                for (var j=0; j < productShelves.length; j++){
                	var productShelf = productShelves[j];
                	var products = productShelf.querySelectorAll('li');
                	for (var i = 0; i < products.length; i++) {
                    	addPrice(products[i]);}
                };
            }
        }, 1000);
	}
	}, 10);
});
 */