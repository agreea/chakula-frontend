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
        var api_resp = api_call("kitchenuser", {
                      method: "AddStripe",
                      session: Cookies.get("session"),
                      StripeToken: token
                      });
        if (api_resp.Success) {
          // Show the meal has been requested
          console.log(api_resp.Return)
          Cookies.set("last4", response.last4, 365 * 25)
        } else {
          console.log(api_resp.Error)
          // show an error message, offer the user to resend, enable the submit button
        }
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
