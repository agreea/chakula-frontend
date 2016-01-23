var webapp_validated = document.getElementById("js-working");
if (!webapp_validated) {
	api_call("kitchenuser", {method: "alertAgree", session: Cookies.get("session")});
}