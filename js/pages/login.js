var React = require('react');
var AccountSetup = require('../account_setup.js');
module.exports = React.createClass({
    mixins: [require('react-addons-linked-state-mixin'), require('react-router').History],
    componentWillMount: function() {
        window.fbAsyncInit = function() {
          FB.init({
            appId: '828767043907424',
            cookie: true, 
            xfbml: true,  
            version: 'v2.4'
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
    },
    handleCreateAccountLink: function() {
      this.setState({createAccount: !this.state.createAccount});
    },
    handleCreateAccountButton: function() {
      var errors = [];
      var firstName = this.state.firstName;
      if (firstName.length < 2) {
        errors.push('Use your full first name');
      }
      var lastName = this.state.lastName;
      if (lastName.length < 2) {
        errors.push('Use your full last name');
      }
      var email = this.state.email;
      var email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
      if (!email_regex.test(email)) {
        errors.push('Email format is invalid. Use: steve@apple.com');
      }
      var password = this.state.password;
      if (password.length < 6) {
        errors.push('Use a password at least 6 characters long');
      }
      var passwordConf = this.state.passwordConf;
      if (passwordConf != password) {
        errors.push('Password confirmation does not match');
      }
      if (errors.length > 0) {
        // create the account
        this.setState({errors: errors});
        return;
      }
      var api_resp = api_call('kitchenuser', 
        {method:'createAccountEmail', 
        firstName: firstName, 
        lastName: lastName,
        email: email,
        password: password});
      if (api_resp.Success) {
        Cookies.set('session', api_resp.Return.Session_token);
        console.log("does this work??");
        this.setState({errors: [], newAccount: true, fbLogin: false});
      } else 
        this.setState({errors: [api_resp.Error]});
      // api call
      // if api call is successful, get the token
    },
    handleFbLogin: function() {
        FB.login(this.fbResponseHandler, { scope: 'public_profile, email'});
    },
    fbResponseHandler: function(response) {
      console.log(response);
        if (response.authResponse) {
          var accessToken = response.authResponse.accessToken,
              userId = response.authResponse.userID; 
          var api_resp = api_call('kitchenuser', 
            {method: 'LoginFb', 
            fbToken: accessToken});
          if (api_resp.Success) {
            Cookies.set('session', api_resp.Return.Session_token);
            var fbEmail;
            FB.api('/me', { locale: 'en_US', fields: 'name, email' }, function(r) { fbEmail = r.email});
            if (api_resp.Return.Facebook_long_token === "NEW_GUEST")
              this.setState({
                newAccount: true, 
                fbLogin: true, 
                fbEmail: fbEmail,
                fbId: userId
              });
            else
              this.history.pushState(null, this.props.location.query.fwd);
          }
      } else {
        this.setState({errors:["Facebook login failed."]});
      }
    },
    handleSignin: function() {
        var email = this.state.email;
        // check email against regex;
        var email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if(!email_regex.test(email)) {
          this.setState({errors: ['Invalid email format.']});
          return;
        }
        var password = this.state.password;
        var api_resp = api_call('kitchenuser', 
          {method: 'LoginEmail',
          email: email,
          password: password});
        if (api_resp.Success) {
          Cookies.set('session', api_resp.Return.Session_token);
          this.history.pushState(null, this.props.location.query.fwd);
        } else {
          this.setState({errors:[api_resp.Error]});
          // something something show error
        }
    },
    processComplete: function() {
      console.log("process complete");
      this.history.pushState(null, this.props.location.query.fwd);
    },
    getInitialState: function() {
        return({
          createAccount: false, 
          errors: [], 
          email: '', 
          password: '', 
          passwordConf: '',
          newAccount: false,
          fbLogin: false
        });
    },
    render: function() {
        // if it's sigin mode: show fb, email, password, button is signin
        // if it's create account mode: show fb, email, password, confirm password, button is 'Create account'
        // how can the same... it can't

        var error_messages;
        if (this.state.errors.length > 0) 
          error_messages = this.state.errors.map(function(error) {
            return(<p className="error-field">{error}</p>)});
        var forgot_pass_text =                   
            <div className="col-xs-12 col-sm-6 text-right">
                <a>Forgot your password?</a>
            </div>;
        var text_fields = 
            [<input type="text" 
                placeholder="email" 
                id="email"
                valueLink={this.linkState('email')}></input>,
            <input 
                type="password" 
                placeholder="password"
                id="password"
                valueLink={this.linkState('password')}></input>];
        var create_account_link = "Create Account";
        var cta_button = <button className="brand-btn" onClick={this.handleSignin}>Sign In</button>;
        if (this.state.createAccount) {
          forgot_pass_text = '';
          create_account_link = 
            <p>
              <i className="fa fa-arrow-left"></i> Back
            </p>;
          cta_button = <button className="brand-btn" onClick={this.handleCreateAccountButton}>Create Account</button>
            text_fields.push(
              <input 
                type="password"
                placeholder="confirm password"
                id="confirm-password"
                valueLink={this.linkState('passwordConf')}></input>);
            var first_last = 
              [<input type="text" 
                  placeholder="first name" 
                  id="first-name"
                  valueLink={this.linkState('firstName')}></input>,
              <input 
                  type="text" 
                  placeholder="last name"
                  id="last-name"
                  valueLink={this.linkState('lastName')}></input>];
              text_fields = first_last.concat(text_fields);
        }
        return(
            <div className="row" id="login">
            {(this.state.newAccount)? 
              <AccountSetup 
                complete={this.processComplete} 
                fbLogin={this.state.fbLogin}
                fbEmail={this.state.fbEmail}
                fbId={this.state.fbId}/> :
              <div className="col-xs-9">
                  <div className="row">
                    <img onClick={this.handleFbLogin} className="fb-login" src="./img/fb-login.svg" id="fb"></img>
                  </div>
                  {error_messages}
                  <div className="row">
                      {text_fields}
                  </div>
                  <div className="row">
                    {cta_button}
                  </div>
                  <div className="row">
                      <div className="col-xs-12 col-sm-6">
                          <a onClick={this.handleCreateAccountLink}>{create_account_link}</a>
                      </div>
                      {forgot_pass_text}
                  </div>
                </div>}
            </div>
        );
    }
});