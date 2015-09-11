// get the meal details
cards = Cookies.getJSON('cards')
// var subtotal = 
$('#subtotal-price').text("$" + 10.50);
$('#processing-price').text()
$('#total-price')
$('#last-4').text("..." + cards[cards.length - 1])

// get the meal id
// get the meal's cost (in cents)
// add 2.9% + 30 cents
// show dat
$('#modal-body').find('#send-request-btn').click(function() {
    console.log("Sending request...")
    var api_resp = api_call("kitchenRequest", {
                      method: "sendRequest",
                      session: Cookies.get("session"),
                      meal: urlVars["Id"],
                      last4: 1234
                    });
    if (api_resp.Success) {
      // save the request in the cookies
      // disable the request buton
    } else {
      // show that the request didn't process, ask them to try again
    }
})