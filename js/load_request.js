function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(document).ready(function() {
	params = getUrlVars();
	console.log(params.Id)
	// resp = api_call('mealrequest', {
 //                method: "GetRequest",
 //                requestId: params.Id,
 //            });
// get request according to id
// getRequest returns 	{ guestName: String, imgUrl: string, mealTitle: String}
// change img source
// change name field
// change meal title
// request handle:
});
