var React = require('react'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	componentWillMount: function() {
		if (Cookies.get("session")) {
			var api_resp = api_call('host', {
		                method: "StripeConnect",
		                auth: params.code,
		 				session: Cookies.get("session") 
		            });
			this.setState({success: api_resp.Success});
		}
	},
	renderSuccess: function() {
		return <h1>Successfully Connected to Stripe!</h1>
	},
	renderLogin: function() {
		return(
			<h1>Login to Chakula to Connect With Stripe</h1>
			<Link to={"login?fwd=" + window.location.search.slice(1)} />
				<button className="c-blue-bg">Login</button>
			</Link>
		);
	},
	renderError: function() {

	},
	getInitialState: function() {
		return({success: false});
	},
	render: function() {
		if (this.state.success)
			return this.renderSuccess();
		else if (!Cookies.get('session'))
			return this.renderLogin();
		else 
			return this.renderError();
	}
});
function sendStripeData() {
	params = getUrlVars();
	api_resp = api_call('host', {
                method: "StripeConnect",
                auth: params.code,
 				session: Cookies.get("session") 
            });
	if (api_resp.Success) {
		$('#status-label').text("Successfully Connected Your Stripe Account!");
  		window.location.replace("https://yaychakula.com/my_meals.html");
	} else {
		$('#status-label').text(api_resp.Error);
		console.log(api_resp.Error);
		// show failure
	}
}