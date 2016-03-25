var React = require('react');
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
        var fwd = this.props.location.query.fwd;
        this.history.pushState(null, "account_setup?fwd="+fwd);
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
            fbId = response.authResponse.userID;
        console.log(response.authResponse);
        this.setState({fbId: fbId})
        var api_resp = api_call('kitchenuser', 
          {method: 'LoginFb', 
          fbToken: accessToken,
          email: response.authResponse.email
        });
        if (api_resp.Success) {
          Cookies.set('session', api_resp.Return.Session_token, {expires: 59});
          if (api_resp.Return.Facebook_long_token === "NEW_GUEST")
            FB.api('/me', { locale: 'en_US', fields: 'name, email'}, this.fbRegistrationSuccess);
          else
            this.history.pushState(null, this.props.location.query.fwd);
        }
      } else {
        this.setState({errors:["Facebook login failed."]});
      }
    },
    fbRegistrationSuccess: function(fb_response) {
      var fwd = this.props.location.query.fwd;
      this.history.pushState(null, 
        "account_setup?&fbEmail=" + fb_response.email +
        "&fbLogin=true&fbId=" + this.state.fbId + 
        "&fwd=" + fwd);
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
          createAccount: this.props.location.query.signup, 
          errors: [], 
          email: '', 
          password: '', 
          passwordConf: '',
          newAccount: false,
          fbLogin: false
        });
    },
    renderTextFields: function() {
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
      if (this.state.createAccount){
        text_fields.push(<input 
          type="password"
          placeholder="confirm password"
          id="confirm-password"
          valueLink={this.linkState('passwordConf')}/>);

        var first_last = 
          [<input type="text" 
              placeholder="first name" 
              id="first-name"
              valueLink={this.linkState('firstName')}/>,
          <input 
              type="text" 
              placeholder="last name"
              id="last-name"
              valueLink={this.linkState('lastName')}/>];
        text_fields = first_last.concat(text_fields);
      }
      return (<div className="row">{text_fields}</div>);
    },
    renderErrorMessages: function() {
      var error_messages;
      if (this.state.errors.length > 0) 
        error_messages = this.state.errors.map(function(error) {
          return(<p className="error-field">{error}</p>)});
      return (<div className="row">{error_messages}</div>);
    },
    renderLogin: function(){
      return (
        <div className="row" id="login">
          <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
            <h3 className="text-center">Sign In</h3>
            <div className="row text-center">
              <img onClick={this.handleFbLogin} className="fb-login" src="/img/fb-login.svg" id="fb"></img>
            </div>
            <p className="text-center"> - or - </p> 
            {this.renderErrorMessages()}
            {this.renderTextFields()}
            <div className="row text-right">
              <button className="brand-btn btn-login" onClick={this.handleSignin}>Sign In</button>   
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-6">
                <a onClick={this.handleCreateAccountLink}>Create Account</a>
              </div>
              <div className="col-xs-12 col-sm-6 text-right">
                <a>Forgot your password?</a>
              </div>                
            </div>
          </div>
        </div>);
    },
    renderCreateAccount: function(){
        return(
          <div className="row" id="login">
            <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
              <h3 className="text-center">Create Account</h3>
              <p>Join the Chakula community to reserve your spot at the table. </p>
              <div className="row text-center">
                <img onClick={this.handleFbLogin} className="fb-login" src="/img/fb-login.svg" id="fb"></img>
              </div>
              <p className="text-center"> - or - </p> 
              {this.renderErrorMessages()}
              <div className="row">
                {this.renderTextFields()}
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <a onClick={this.handleCreateAccountLink}>
                    <i className="fa fa-arrow-left"></i> Back
                  </a>
                </div>
                <div className="col-xs-6 text-right">
                  <button className="brand-btn btn-login" 
                    onClick={this.handleCreateAccountButton}>Create Account</button>
                </div>
              </div>
            </div>
          </div>);
    },
    render: function() {
      if(this.state.createAccount)
        return this.renderCreateAccount();
      else
        return this.renderLogin();
    }
});