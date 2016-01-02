module.exports = React.createClass({
	getInitialState: function() {
		return (
			{
				phone: "", 
				pin: "", 
				sendCodePressed: false, 
				verified: false, 
				errors: []
			});
	},
	handleInputChange: function(e) {
		var obj = {},
			key = e.target.id,
			val = e.target.value;
		obj[key] = val;
		if (key === "phone")
			obj["verified"] = false;
		this.setState(obj);
	},
	handleSendCodeClicked: function(){
		// regex phone
		var phone = this.state.phone,
			errors = [];
		if (!/^\d+$/.test(phone)) 
			errors.push("Phone must be digits only");
		if (phone.length !== 10) 
			errors.push("Phone must be 10 digits only");
		this.setState({errors: errors});
		if (errors.length > 0) 
			return;
		var api_resp = api_call("kitchenuser", {
			method: "updatePhone",
			session: Cookies.get("session"),
			phone: phone
		});
		if (api_resp.Success)
			this.setState({sendCodePressed: true});
	},
	handleVerifyClicked: function() {
		var pin = this.state.pin;
		if (!pin || pin.length < 1) {
			this.setState({errors: ["Code cannot be empty"]});
			return;
		}
		var api_resp = api_call("kitchenuser", {
			method: "verifyPhone",
			session: Cookies.get("session"),
			pin: pin
		});
		var errors = [];
		if (api_resp.Success) 
			this.props.success("phoneAdded");
		else
			errors.push(api_resp.Error);
		this.setState({
			verified: api_resp.Success, 
			errors: errors,
		});
	},
	render: function() {
		var s = this.state;
		var verifyInput = (s.sendCodePressed)?
					<div className="input-group">
						<input type="text" 
							placeholder="Verify Code" 
							value={s.pin}
							id="pin"
							className="text-field"
							onChange={this.handleInputChange}></input>
				   <span className="input-group-btn">
						<button className="c-blue-bg" onClick={this.handleVerifyClicked} disabled={s.verified}>{(s.verified)? <p><i className="fa fa-check"></i> "Verified"</p> : "Verify"}</button>
				   </span>
				</div> : "";
		return (
			<div className="col-xs-8">
				<h3>Add Phone</h3>
				<p>Verifying your phone number will help confirm your identity and allow us to send you real time updates about the meals you attend.</p>
				<div className="input-group">
					<input type="text" 
							placeholder="1234567890" 
							value={s.phone}
							id="phone"
							className="text-field"
							onChange={this.handleInputChange}></input>
				   <span className="input-group-btn">
				        <button className="brand-btn" onClick={this.handleSendCodeClicked}>{(s.sendCodePressed)? "Resend PIN" : "Send PIN"}</button>
				   </span>
				</div>
				{verifyInput}
				<ul className="error-field text-left">
					{(s.errors)? 
						s.errors.map(function(error){return <li>{error}</li>}) : ""}
				</ul>
			</div>);
	}
});