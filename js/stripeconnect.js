$(document).ready(function() {
	// get error, if it's not null show an error message and return
	// get authorization code
	code = params.code
	session = getCookie("session")
	if (session ===  ""){
		// login flow
		// then send Stripe data
	}
	// if the user doesn't have a session cookie, ask him/her to Login
	// once they login, successfully, send over the Stripe data (api call)
	// send it to server using 'host' { method: "StripeConnect", auth: params.Authorization_code, session: session }
	// if the response is a success, show it
	// if the response is a failure, show it
);

function sendStripeData() {
	params = getUrlVars();
	session = getCookie("session")
	resp = api_call('host', {
                method: "StripeConnect",
                auth: params.code,
 				sessionId: session 
            });
	if (resp.Success) {
		// show it
		console.log("We did it!")
	} else {
		// show failure
	}
}
