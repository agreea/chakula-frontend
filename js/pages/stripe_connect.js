function sendStripeData() {
	params = getUrlVars();
	api_resp = api_call('host', {
                method: "StripeConnect",
                auth: params.code,
 				session: Cookies.get("session") 
            });
	if (api_resp.Success) {
		$('#status-label').text("Successfully Connected Your Stripe Account!");
  		window.location.replace("https://yaychakula.com/my_meals.html");
	} else {
		$('#status-label').text(api_resp.Error);
		console.log(api_resp.Error);
		// show failure
	}
}