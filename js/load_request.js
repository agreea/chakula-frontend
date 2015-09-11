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
			$("#waddaya").html("");
			if (request.Status === 1) {
				$("#btn-result-row").html("<p class='text-center'>You welcomed them! Get pumped.</p>");
			} else {
				$("#btn-result-row").html("<p class='text-center'>You declined them. Bummer.</p>");
			}
		} else {
			$("#join-text").html("wants to join <b>" + request.Meal_title + "</b>");
		}
	} else {
		alert("Couldn't load your request. Please try again!")
	}
	$('.btn-welcome').click(function(){
		api_resp = api_call('mealrequest', {
                method: "Respond",
                requestId: params.Id,
                response: 1
            });
		console.log(api_resp);
		if (api_resp.Success) {
			location.reload();
		}
	})
	$('.btn-decline').click(function(){
		api_resp = api_call('mealrequest', {
			method: "Respond",
			requestId: params.Id,
			response: -1
		})
		console.log(api_resp);
		if (api_resp.Success) {
			location.reload();
		}
	})
});