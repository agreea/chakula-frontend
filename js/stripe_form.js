    // This identifies your website in the createToken call below
    Stripe.setPublishableKey('pk_live_N4yRGKt9KwKwi9WfpAtnPdMs');
    
    var stripeResponseHandler = function(status, stripe_resp) {
      var $form = $('#payment-form');
      if (stripe_resp.error) {
        // Show the errors on the form
        console.log("There was an error")
        $form.find('.payment-errors').text(stripe_resp.error.message);
        $form.find('button').prop('disabled', false);
      } else {
        // token contains id, last4, and card type
        var token = stripe_resp.id;
        console.log("Stripe response: " + token);
        console.log("Stripe last 4: " + stripe_resp.card.last4)
        console.log(stripe_resp)
        var api_resp = api_call("kitchenuser", {
                      method: "AddStripe",
                      session: Cookies.get("session"),
                      StripeToken: token,
                      last4: stripe_resp.card.last4
                      });
        if (api_resp.Success) {
          // Save the card
          console.log(api_resp.Return)
          Cookies.getJSON('cards')
          if (cards === undefined) { // create the last4 digits array if you don't have one already
            var cards = [stripe_resp.card.last4]
            Cookies.set('cards', cards)
          } else {
            cards = Cookies.getJSON('cards')
            cards.push(stripe_resp.last4)
            Cookies.set('cards', cards)
          }
          $('#modal-body').load("include/request_invoice.html")
        } else {
          $form.find('button').prop('disabled', false);
          console.log(api_resp.Error)
          // show an error message, offer the user to resend, enable the submit button
        }
      }
    };

    jQuery(function($) {
      $('#payment-btn').click(function(e) {
        var $form = $('#payment-form');
        // Disable the submit button to prevent repeated clicks
        console.log("Disabled submit...!")
        $form.find('button').prop('disabled', true);
        Stripe.card.createToken($form, stripeResponseHandler);
        // Prevent the form from submitting with the default action
        return false;
      });
    });
