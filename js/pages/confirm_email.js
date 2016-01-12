var React = require("react");

module.exports = React.createClass({
	componentWillMount: function() {
		var api_resp = api_call("kitchenuser", {
			method: "verifyEmail",
			Code: this.props.location.query.Code,
			Id: this.props.location.query.Id
		});
		this.setState({success: api_resp.Success});
	},
	renderFail: function() {
		return (
			<div>
				<h3 className="text-center">{"Couldn't verify your email."}</h3>
			</div>
		);
	},
	renderSuccess: function() {
		return (
			<div className="text-center">
				<h3>{"Email verified!"}</h3>
				<p>{"This will now show on your guest profile"}</p>
				<button className="c-blue-bg">View Guest Profile</button>
			</div>
		);
	},
	render: function() {
		return (
			<div id="confirm-email">
				(this.state.success)?
					this.renderSuccess() :
					this.renderFail()
			</div>
		)
	}
});