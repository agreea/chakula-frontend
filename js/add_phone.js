jQuery(function($) {
      $('#add-phone-btn').click(function(e) {
        var $phone_field = $('#phone-field');
        var phone_input = $phone_field.val()
        var reg = /^\d+$/;
        console.log(reg.test(phone_input));
        if (reg.test(phone_input)) {
          api_resp = api_call("kitchenuser", {
                        method: "AddPhone",
                        session: Cookies.get("session"),
                        phone: $phone_field.val(),
                        });
          if (api_resp.Success) {
            $('#modal-body').load('include/phone_add_success.html')
            // show the success screen
          } else {
            $('#phone-errors').text(api_resp.Error)
          }
        } else {
            $('#phone-errors').text("Please enter numbers only.")
        }
        // check if the entry is 10 digits
        // if it is, send it to the server
        // if there's a success, show it on the screen
        // if there's an error, show the error in the error field
        // Prevent the form from submitting with the default action
        return false;
      });
});