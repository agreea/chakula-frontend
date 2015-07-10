$(document).ready(function(event){
    $( ".item" ).click(function() {
    	    alert("order.html" + "#" + 
        	$(this).find(".item-title").text().split(' ').join("_") + "+" + // extract title with underscores
        	$(this).find(".item-price").text().substring(str.slice(1)); // extract price without "$")
        window.location.href = "order.html" + "#" + 
        	$(this).find(".item-title").text().split(' ').join("_") + "+" + // extract title with underscores
        	$(.this).find(".item-price").text().substring(str.lastIndexOf("$")+1);
    });
});
