      window.fbAsyncInit = function() {
        FB.init({
          appId      : '828767043907424',
          cookie     : true,  // enable cookies to allow the server to access 
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.2' // use version 2.2
        });
        FB.Event.subscribe('auth.login', function(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          console.log("Checkmark checked: ");
          console.log($('subscribe-check').checked);
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
      });
    };

      // Load the SDK asynchronously
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
