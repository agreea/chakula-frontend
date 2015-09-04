    // This identifies your website in the createToken call below
    Stripe.setPublishableKey('pk_live_N4yRGKt9KwKwi9WfpAtnPdMs');
    
    var stripeResponseHandler = function(status, response) {
      var $form = $('#payment-form');
      if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // token contains id, last4, and card type
        var token = response.id;
        console.log("Stripe response: " + token);
        // Insert the token into the form so it gets submitted to the server
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        $form.append($('<input type="hidden" name="session" />').val(getCookie("session"));
        var resp = api_call("kitchenuser", {
                      method: "AddStripe",
                      session: getCookie("session"),
                      stripeToken: token
                      });
        if (resp.Success) {
          // Show the meal has been requested
          console.log(resp.Success)
        } else {
          console.log(resp.Error)
          // show an error message, offer the user to resend, enable the submit button
        }
        // and re-submit
        // $form.get(0).submit();
      }
    };

    jQuery(function($) {
      $('#payment-form').submit(function(e) {
        var $form = $(this);
        // Disable the submit button to prevent repeated clicks
        console.log("Disabled submit...!")
        $form.find('button').prop('disabled', true);
        Stripe.card.createToken($form, stripeResponseHandler);
        // Prevent the form from submitting with the default action
        return false;
      });
    });
