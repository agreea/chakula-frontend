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
		return <h1>Successfully Connected to Stripe!</h1>
	},
	renderLogin: function() {
		var query = window.location.search.replace("?", "");
		var fwd_url = encodeURIComponent("stripe_connect?" + query);
		return(
			<div className="text-center">
				<h1>Login to Chakula to Connect With Stripe</h1>
				<Link to={"login?fwd=" + fwd_url}>
					<button className="c-blue-bg">Login</button>
				</Link>
			</div>
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