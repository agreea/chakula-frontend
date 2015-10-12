jQuery(function($) {
      $('#add-email-btn').click(function(e) {
        var $email_field = $('#email-field');
        var email_input = $email_field.val()
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        console.log(reg.test(email_input));
        if (reg.test(email_input)) { // if the email is valid
          api_resp = api_call("kitchenuser", {
                        method: "AddEmail",
                        session: Cookies.get("session"),
                        email: $email_input,
                        subscribe: true
                        });
          if (api_resp.Success) {
            // if there's no cards:
            getCards();
            if(Cookies.getJSON("cards") === undefined || 
                Cookies.getJSON("cards").length === 0 || 
                Cookies.getJSON("cards")[0] === null) {
                console.log("No card");
                $('#modal-body').load('include/stripe_form.html');
            } else { // if there's 
              $('#modal-body').load('include/request_invoice.html');
            }
            // else show them the invoice
            // show the success screen
          } else {
            $('#email-errors').text(api_resp.Error)
          }
        } else { // the email wasn't valid, let em know
            $('#email-errors').text("Please enter numbers only.")
        }
        // check if the entry is 10 digits
        // if it is, send it to the server
        // if there's a success, show it on the screen
        // if there's an error, show the error in the error field
        // Prevent the form from submitting with the default action
        return false;
      });
});