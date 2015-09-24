  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    console.log("Check box checked?");
    checkbox = $('#modal-body').find('#subscribe-check');
    console.log(checkbox.prop('checked'))
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log("Token: " + response.authResponse.accessToken)
      var cookie = Cookies.get("session")
      if (cookie === undefined || cookie === "") {
          resp = api_call('kitchenuser', {
                method: "Login",
                fbToken: response.authResponse.accessToken,
                subscribe: checkbox.prop('checked'),
                });
          if (resp.Success) {
            console.log("Here is the result: " + resp.Return.Session_token);
            Cookies.set("session", resp.Return.Session_token, { expires: 50 });
            getCards();
            getMeal();
            console.log("from cookie: " + Cookies.get("session"))
          }
      } else {
          console.log("Didn't call API. from cookie: " + cookie)
          // $('#signin-dropdown').text('Agree') // TODO: get user data from chakula.
      }
      cards = Cookies.getJSON("cards")
      if (cards === undefined || cards.length === 0 || cards[cards.length - 1] === undefined) {
          $('#modal-body').load('include/stripe_form.html');
      } else {
        console.log("Here's what i see:")
        console.log(cards[cards.length - 1])

          $('#modal-body').load('include/request_invoice.html');
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
// create a button with a listener
// listener is a FB.login() function:
// FB.login(function(response) {
   // handle the response
// }, {scope: 'public_profile,email,likes'});
//
  window.fbAsyncInit = function() {
      FB.init({
        appId      : '828767043907424',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.4' // use version 2.2
      });
      FB.Event.subscribe('auth.login', function(response) {
        statusChangeCallback(response)
      });

      // FB.getLoginStatus(function(response) {
      //   statusChangeCallback(response);
      // });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }