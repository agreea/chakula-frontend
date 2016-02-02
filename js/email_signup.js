var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return ({
				email: '',
				success: false,
				errors: []
			});
	},
	handleSubscribeClicked: function() {
		var email = this.state.email,
			email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		if (!email_regex.test(email)) {
			this.setState({errors: ["Invalid email format. Use john@example.com."]});
			return;
		}
		var api_resp = api_call("kitchen", {
			method: "Register",
			email: email
		});
		if (api_resp.Success) {
			this.setState({success: true});
			Cookies.set('email', email);
		} else {
			this.setState({errors: [api_resp.Error]});
		}
	},
	handleInputChange: function(e) {
		this.setState({email: e.target.value});
	},
	renderSuccess: function() {
		return(
			<div className="text-center">
				<h3>Thanks for Signing Up!</h3>
				<p>{"You'll receive weekly deliciousness in your inbox in no time :)"}</p>
			</div>
		);
	},
	renderSignup: function() {
		var s = this.state;
		return(
			<div>
				<p>Never miss out on the chance to eat delicious food with great company.</p>  
				<div className="input-group">
					<input type="text" 
						placeholder="Your email" 
						value={s.email}
						id="email"
						className="text-field"
						onChange={this.handleInputChange}></input>
				   <span className="input-group-btn">
				        <button className="c-blue-bg"
				        	onClick={this.handleSubscribeClicked}>Submit</button>
				   </span>
				</div>
				<ul className="error-field">{s.errors.map(function(error, i){
					return <li key={i}>{error}</li>
				})}
				</ul>
			</div>
		)
	},
	render: function() {
		var s = this.state;
		return (
			<div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
				{(s.success)? this.renderSuccess() : this.renderSignup()}
			</div>
		);
	}
});