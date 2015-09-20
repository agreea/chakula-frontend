// get the meal details
cards = Cookies.getJSON('cards')
// var subtotal = 
$('#last-4').text("..." + cards[cards.length - 1])
api_resp = getMeal();
if (api_resp.Success) {
  $('#total').text("$" + meal_data.Price);
}
// get the meal id
// get the meal's cost (in cents)
// add 2.9% + 30 cents
// show dat
$('#modal-body').find('#send-request-btn').click(function() {
    console.log("Sending request for id: " + urlVars["Id"])

    var api_resp = api_call("mealrequest", {
                      method: "sendRequest",
                      session: Cookies.get("session"),
                      mealId: urlVars["Id"],
                      last4: 1234
                    });
    console.log(api_resp);
    if (api_resp.Success) {
      // if user.phone = "" (does this really matter??. No. It doesn't.)
      $('#modal-body').load("include/add_phone.html")
      $('#request-meal-btn').text("Pending");
      request_button.css("background-color", "#8cd3e8");
      request_button.css("color", "#2e464c");
      request_button.prop('disabled', true);
      // save the request in the cookies
      // disable the request buton
    } else {
        $('#modal-body').find('#request-errors').text(api_resp.Error);
      // show that the request didn't process, ask them to try again
    }
})