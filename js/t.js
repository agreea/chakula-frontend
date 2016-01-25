var webapp_validated = document.getElementById("js-working");
if (!webapp_validated) {
	api_call("kitchenuser", {
		method: "alertAgree", 
		session: Cookies.get("session"),
		url: window.location.href.split("yaychakula.com")[1]
	});
	console.log(window.location.href)
	console.log(window.location.href.split("yaychakula.com"))
	console.log(window.location.href.split("yaychakula.com")[1])

}