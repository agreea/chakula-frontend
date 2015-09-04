  api_call = function(api_fragment, data) {
    var response = $.ajax({
                      url: 'api/' + api_fragment,
                      method: 'POST',
                      data: data,
                      dataType: 'json',
                      async: false,}).responseText;
    return JSON.parse(response);
  }

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      console.log("Token: " + response.authResponse.accessToken)
      var cookie = getCookie("session")
      if cookie === "" {
          resp = api_call('kitchenuser', {
                method: "Login",
                fbToken: response.authResponse.accessToken,
                });
          if (resp.Success) {
            console.log("Here is the result: " + resp.Return.Session_token);
            createCookie("session", resp.Return.Session_token);
            console.log("from cookie: " + getCookie("session"))
          }
      }
    } else if (response.status === 'not_authorized') {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '828767043907424',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    if (response.status === 'connected') {
      console.log(response.authResponse.accessToken);
      // todo: send token to Ross
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

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log(response.id)
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}
