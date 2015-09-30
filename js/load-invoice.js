$('#invoice').ready(function(){
  cards = Cookies.getJSON('cards')
  // set the card # and total price (assuming one seat)
  var plate_price = Math.round(meal_data.Price*100)/100;
  $('#last-4').text("..." + cards[cards.length - 1]);
  $('#total').text("$" + plate_price);

  // set up the +1 options; cap at the lesser of 4 or open seats
  var max_seats = 4;
  if (meal_data.Open_spots < 4) {
    max_seats = meal_data.Open_spots;
  }
  for (var i = 0; i < max_seats; i++) {
    $('<li><a onclick="setSeats(' +
      (i+1) + ')">' + 
      (i+1) + '</a></li>').appendTo('#seats-dropdown-options');
  }

  $('#modal-body').find('#send-request-btn').click(function() {
      console.log("Sending request for id: " + urlVars["Id"])

      var api_resp = api_call("mealrequest", {
                        method: "sendRequest",
                        session: Cookies.get("session"),
                        mealId: urlVars["Id"],
                        seats: seats,
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
  });
});

  // called whenever user selects a dropdown
var seats = 1;
setSeats(count) {
    seats = count;
    $('#seats-dropdown').html(seats + ' <span class="caret"></span>');
    // set the dropdown text to the seat count
    // set the total price
    $('#total').text("$" + (plate_price * seats));
}

