function addPrice(product)
{
    var description = product.getElementsByClassName('description')[0];
    var price = product.getElementsByClassName('price')[0].getElementsByTagName('span')[0].textContent;
    var size = product.getElementsByClassName('size')[0].textContent;
    var pricePerKilo = price.replace("$", "")/size.replace(" g", "") * 1000;
    description.innerHTML += "$"+ pricePerKilo.toFixed(2) +" /kg";
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

        setTimeout(function () {
            if (document.getElementsByClassName("productShelf")) {
                var productShelf = document.getElementsByClassName("productShelf")[0];
                var products = productShelf.querySelectorAll('li.product');
                for (var i=0; i<=products.length; i++) {
                    addPrice(products[i]);
                }
            }
        }, 5000);

	}
	}, 10);
});
