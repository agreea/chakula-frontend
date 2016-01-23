var webapp_validated = $("#js-working");
console.log(webapp_validated);
if (!webapp_validated) {
	api_call("kitchenuser", {method: "alertAgree", session: Cookies.get("session")});
}