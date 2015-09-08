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
	resp = api_call('mealrequest', {
                method: "GetRequest",
                requestId: params.Id,
            });
	if (resp.Success) {
		request = resp.Return
		$("#guest-name").html(request.Guest_name);
		$("#guest-pic").attr("src",request.Guest_pic);
		if (request.Status != 0) {
			$("#join-text").html("asked to join <b>" + request.Meal_title + "</b>");
			if (request.Status === 1) {
				$("#btn-result-row").html("<p>You welcomed them.</p>");
			} else {
				$("#btn-result-row").html("<p>You declined them.</p>");
			}
		} else {
			$("#join-text").html("wants to join <b>" + request.Meal_title + "</b>");
		}
	} else {
		alert("Couldn't load your request. Please try again!")
	}
});