var React = require('react'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	componentWillMount: function() {
		if (Cookies.get("session")) {
			var api_resp = api_call('host', {
		                method: "StripeConnect",
		                auth: this.props.location.query.code,
		 				session: Cookies.get("session") 
		            });
			this.setState({success: api_resp.Success});
		}
	},
	renderSuccess: function() {
		return(
			<div className="text-center">
				<h1>Successfully Connected to Stripe!</h1>
				<p>You can now create listings for your meals, popups, and cooking classes</p>
				<Link to="/my_meals">
					<button className="c-blue-bg cta">Create Your First Meal</button>
				</Link>
			</div>

		)
	},
	renderLogin: function() {
		var query = window.location.search.replace("?", "");
		return(
			<div className="text-center">
				<h1>Login to Chakula to Connect With Stripe</h1>
				<Link to={"login?fwd=" + "/stripe_connect?" + query}>
					<button className="c-blue-bg cta">Login</button>
				</Link>
			</div>
		);
	},
	renderError: function() {
		return(
			<div className="text-center">
				<h1>Failed to Connect With Stripe</h1>
			</div>
		)
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