function addPrice(product)
{
    var description = product.getElementsByClassName('description')[0];

    var priceSpan = product.querySelector('[itemprop=price]').textContent;
    var price = priceSpan.replace("$", "");

    var sizeSpan = product.getElementsByClassName('size')[0].textContent;
    if (sizeSpan.indexOf('x') > -1) {
        var total = 1;
        for (var i = 0; i < sizeSpan.split(' x ').length; i++) {
            elem = sizeSpan.split(' x ')[i];
            if (elem.indexOf('g') > -1) {
                elem = elem.replace(" g", "");
            }
            total *= elem;
        }
    } else {
        var total = sizeSpan.replace(" g", "");
    }
    var sizeInKilo = total / 1000;

    var pricePerKilo = price/sizeInKilo;
    description.innerHTML += "$"+ pricePerKilo.toFixed(2) +" /kg";
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        setTimeout(function () {
            if (document.getElementsByClassName("productShelf")) {
                var productShelf = document.getElementsByClassName("productShelf")[0];
                var products = productShelf.querySelectorAll('li');
                for (var i = 0; i < products.length; i++) {
                    addPrice(products[i]);
                }
            }
        }, 5000);

	}
	}, 10);
});
