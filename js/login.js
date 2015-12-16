module.exports = React.createClass({
    mixins: [require('react-addons-linked-state-mixin')],
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
        this.setState({errors: []});
      }
      // api call
      // if api call is successful, get the token
    },
    handleFbLogin: function() {
        FB.login(
            function(response) {
                if (response.authResponse) {
                    var access_token = response.authResponse.accessToken; //get access token
                    var user_id = response.authResponse.userID; //get FB UID
                    // get session from server by calling Login
                    // FACEBOOK LOGIN :O :O :O
                    // NOT DONE NOT DONE NOT DONE NOT DONE NOT DONE NOT DONE NOT DONE NOT DONE NOT DONE
                    var api_resp = api_call('kitchenuser', 
                      {method: 'LoginFb', 
                      fbToken: access_token});
                    if (api_resp.Success) {
                      this.props.handleLoginSuccess();
                    }
                        // if that's successful, then load whatever this was supposed to load
                } else {
                  this.setState({errors:["Facebook login failed."]});
                }
            }, 
            { scope: 'public_profile, email'});
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
          this.props.handleLoginSuccess();
        } else {
          this.setState({errors:[api_resp.Error]});
          // something something show error
        }
        // send email and pass to server
        // server sends back session if valid
        // if api resp is successful, load modal with the gosh dang checkout interface?
        // if not, show an error
    },
    getInitialState: function() {
        return({
          createAccount: false, 
          errors: [], 
          email: '', 
          password: '', 
          passwordConf: ''});
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
            <div className="row">
                <div className="row">
                    <a href="#" onClick={this.handleFbLogin}>
                        <img src="./img/fb-login.svg"></img>
                    </a>
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
                        <a href="#" onClick={this.handleCreateAccountLink}>{create_account_link}</a>
                    </div>
                    {forgot_pass_text}
                </div>
            </div>
        );
    }
});