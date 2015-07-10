$(document).ready(function(event){
    $( ".item" ).click(function() {
    	alert("order.html" + "#" + 
        	jQuery(this).find("item-title").text().split(' ').join("_") + "&" + // extract title with underscores
        	jQuery(this).find("item-price").text().substring(str.lastIndexOf("$")+1)); // extract price without "$")
        // window.location.href
    });
});
