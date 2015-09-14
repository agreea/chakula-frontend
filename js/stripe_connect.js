function sendStripeData() {
	params = getUrlVars();
	session = Cookies.get("session")
	api_resp = api_call('host', {
                method: "StripeConnect",
                auth: params.code,
 				session: session 
            });
	if (api_resp.Success) {
		console.log("We did it!")
		$('#status-label').text("Successfully Connected Your Stripe Account!")
	} else {
		$('#status-label').text(api_resp.Error);
		console.log(api_resp.Error);
		// show failure
	}
}
