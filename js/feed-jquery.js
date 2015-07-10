$(document).ready(function(event){
    $( ".item" ).click(function() {
        window.location.href = "order.html" + "#" + 
        	$(this).find(".item-title").text().split(' ').join("_") + "+" + // extract title with underscores
        	$(this).find(".item-price").text().slice(1);
    });
});
