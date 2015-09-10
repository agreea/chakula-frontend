  // This is called with the results from from FB.getLoginStatus().
  var statucChangeCallback = function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log("Checkmark checked: ");
      console.log($('subscribe-check').prop('checked'));
      console.log("Token: " + response.authResponse.accessToken);
      var cookie = Cookies.get("session")
      if (cookie === undefined) {
          resp = api_call('kitchenuser', {
                method: "Login",
                fbToken: response.authResponse.accessToken,
                subscribe: false
                });
          if (resp.Success) {
            console.log("Here is the result: " + resp.Return.Session_token);
            Cookies.set("session", resp.Return.Session_token, { expires: 50 });
            console.log("from cookie: " + Cookies.get("session"))
          }
      } else {
          console.log("Didn't call API. from cookie: " + cookie)
      }
      if (Cookies.get("last4") === undefined) {
          $('#modal-body').load('include/stripe_form.html');
      } else {

      }
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }
  function goToPaymentForm() {}
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
