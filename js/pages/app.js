var React = require('react');
var Link = require('react-router').Link;
  var guest;
  window.fbAsyncInit = function() {
      FB.init({
        appId      : '828767043907424',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.4' // use version 2.2
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
    var fb_handler = function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            console.log(response); // dump complete info
            var access_token = response.authResponse.accessToken; //get access token
            var user_id = response.authResponse.userID; //get FB UID
            var cookie = Cookies.get("session");
            if (cookie === undefined || cookie === "") {
                var resp = api_call('kitchenuser', {
                      method: "LoginFb",
                      fbToken: response.authResponse.accessToken
                      });
                if (resp.Success) {
                  console.log("Here is the result: " + resp.Return.Session_token);
                  Cookies.set("session", resp.Return.Session_token, { expires: 50 });
                  console.log("from cookie: " + Cookies.get("session"));
                  load();
                }
                console.log(resp);
            } else {
                console.log("Didn't call API. from cookie: " + cookie);
            }
            // get the profile pic
            // get the First (and last?) name
            // login in to chakula
        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');
        }
    };
    var NavBar = React.createClass({
      componentWillMount: function() {
        if (!Cookies.get("session"))
          return;
        console.log("I don't even care I'm gonna get ")
        var api_resp = 
          api_call('kitchenuser', {method: 'Get', session: Cookies.get("session")});
        if (api_resp.Success)
          this.setState({guest: api_resp.Return});
      },
      login: function() {
        FB.login(fb_handler);
      },
      signout: function() {
        Cookies.remove('session');
        location.reload();
      },
      getInitialState: function() {
        return ({guest: null});
      },
      render: function() {
        var guest = this.state.guest;
        console.log(guest);
        var right_nav;
        if (guest) {
          var pic_src;
          if (guest.Prof_pic) {
            pic_src = "img/" + guest.Prof_pic;
          } else if (guest.Facebook_id) {
            pic_src = "https://graph.facebook.com/" + guest.Facebook_id + "/picture?width=100&height=100";
          }
          var user_tab = (<li id="user">
            <button className="btn dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              <span className="nav-text">{guest.First_name}</span>
              <img className="img-responsive img-circle nav-icon" alt="Brand" src={pic_src} align="right" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="#"></a></li>
              <li><Link to="/edit_profile">My Profile</Link></li>
              <li><a onClick={this.signout}>Signout</a></li>
            </ul>
          </li>);
          var host_tab = (<li className="nav-item">
                      <Link className="nav-item-content" to="/my_meals">
                        <span>Host</span>
                        <img className="img-responsive nav-icon" src="img/host-icon.svg"/>
                      </Link>
                    </li>);
          right_nav = (<ul className="nav navbar-right">
                        {host_tab}
                        {user_tab} 
                      </ul>);
        } else {
          right_nav = 
            <ul className="nav navbar-right">
              <li id="signin" onClick={this.login}> 
                <span className="nav-text">Sign In</span>
                <img className="img-responsive nav-icon" alt="Brand" src="img/user-icon.svg" align="right" />
              </li>
            </ul>
        }
        return(
          <nav className="navbar navbar-default navbar-static-top">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  <img className="img-responsive nav-icon" alt="Brand" src="img/chakula_icon.svg" align="left" />
                </Link>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false" align="right">                
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                {right_nav}
              </div>
            </div>
          </nav>
        );
      }
    });

function load(){
  console.log("inside load()");
    var session = Cookies.get('session');
    console.log("Session: " + session);
    if (session) {
      var api_resp = api_call('kitchenuser', {method: 'Get', session: session});
      if (api_resp.Success){
        guest = api_resp.Return;
      }
      console.log(api_resp);
    }
}

module.exports = React.createClass({
    render: function() {
        return(
            <div className="container-fluid">
                <div>
                    <NavBar/>
                </div>
                {this.props.children}
            </div>
        )
    }
});
