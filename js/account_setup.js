var React = require('react');
var AddPhone = React.createClass({
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
						<button className="c-blue-bg" onClick={this.handleVerifyClicked} disabled={s.verified}>{(s.verified)? "Verified" : "Verify"}</button>
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
var AddEmail = React.createClass({
	getInitialState: function(){
		return {email: ""}
	},
	handleInputChange: function(e) {
		var obj = {},
			key = e.target.id,
			val = e.target.value;
		obj[key] = val;
		this.setState(obj);
	},
	handleAddEmailClicked: function() {
		var email = this.state.email,
			email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
		if (!email_regex.test(email)) {
			this.setState({errors: ["Invalid email format. Use john@example.com."]});
			return;
		}
		var api_resp = api_call("kitchenuser", {
			method: "updateEmail",
			session: Cookies.get('session'),
			email: email
		});
		if (api_resp.Success){
			this.props.success("emailAdded");
		} else {
			this.setState({errors: [api_resp.Error]});
		}
	},
	render: function() {
		var s = this.state;
		return(
			<div className="col-xs-8">
				<h3>Add Email</h3>
				<p>We will send receipts and details, including addresses, for your meals to your email.</p>
				<div className="input-group">
					<input type="text" 
							placeholder="john@exmaple.com" 
							value={s.email}
							id="email"
							className="text-field"
							onChange={this.handleInputChange}></input>
				   <span className="input-group-btn">
				        <button className="c-blue-bg" onClick={this.handleAddEmailClicked}>Add Email</button>
				   </span>
				</div>
				<ul className="error-field">
					{(s.errors)? 
						s.errors.map(function(error){return <li>{error}</li>}) : ""}
				</ul>
			</div>
		);
	}
});
var AddPhoto = React.createClass({
	// do something crazy
	getInitialState: function() {
		return({src: "", errors: []})
	},
	updatePhoto: function(e){
		var pic;
		var api_resp = api_call("kitchenuser", {
			method: "updateProfPic",
			session: Cookies.get("session"),
			pic: pic
		});
		if (api_resp.Success)
			this.setState({src: api_resp.Return.Pic});
		else
			this.setState({errors: [api_resp.Error]});
	},
	render: function(){
		return <p />
	}
});
var AddBio = React.createClass({
	getInitialState: function(){
		return {bio: "", errors: []}
	},
	handleInputChange: function(e) {
		var obj = {},
			key = e.target.id,
			val = e.target.value;
		obj[key] = val;
		this.setState(obj);
	},
	handleAddBioClicked: function() {
		var api_resp = api_call("kitchenuser", {
			method: "updateBio",
			session: Cookies.get('session'),
			bio: this.state.bio
		});
		if (api_resp.Success){
			this.props.success("bioAdded");
		} else {
			this.setState({errors: [api_resp.Error]});
		}
	},
	render: function() {
		var s = this.state;
		return(
			<div className="col-xs-8">
				<h3>Add Bio</h3>
				<p>Please introduce yourself to the Chakula community. :)</p>
				<div className="input-group">
					<textarea type="textarea" 
							placeholder="Where do you work? Where are you from? What are your hobbies?" 
							value={s.bio}
							id="bio"
							className="text-field"
							onChange={this.handleInputChange}></textarea>
				   <span className="input-group-btn">
				        <button className="c-blue-bg" onClick={this.handleAddBioClicked}>Add Bio</button>
				   </span>
				</div>
				<ul className="error-field">
					{(s.errors)? 
						s.errors.map(function(error){return <li>{error}</li>}) : ""}				
				</ul>
			</div>
		);
	}
});

module.exports = React.createClass({
	handleSuccess: function(field_key){
		var obj = {};
		obj[field_key] = true;
		this.setState(obj);
	},
	carouselPressed: function() {
		this.setState({activeScreen: $(".active").attr('id')});
	},
	getInitialState: function() {
		return({activeScreen: "add_phone"})
	},
	render: function(){
		var style = {"marginTop":"52px"},
			s = this.state;
		var inactive_circle = <i className="fa fa-circle-o inactive-gray"></i>,
			active_circle = <i className="fa fa-circle active-green"></i>,
			prev = <a href="#carousel" role="button" data-slide="prev" id="prev">
					<button onClick={this.carouselPressed} className="caro-nav">Previous</button></a>,
			next = <a href="#carousel" role="button" data-slide="next" id="next">
					<button onClick={this.carouselPressed} className="caro-nav">Skip</button></a>,
			cont = <a href="#carousel" role="button" data-slide="next" id="next">
					<button onClick={this.carouselPressed} className="c-blue-bg caro-nav">Continue</button></a>,
			complete_gray = <button onClick={this.props.processComplete} className="caro-nav">Continue</button>,
			complete_blue = <button onClick={this.props.processComplete} className="c-blue-bg caro-nav">Continue</button>;
		var checkmark = <i className="fa fa-check active-green"></i>;
		var addPhoneText = (s.phoneAdded)? <p>{checkmark} Phone Added</p> : <p>Add Phone</p>,
			addEmailText = (s.emailAdded)? <p>{checkmark} Email Added</p> : <p>Add Email</p>,
			addBioText = (s.bioAdded)? <p>{checkmark} Bio Added</p> : <p>Add Bio</p>,
			addFbText = (s.fbAdded)? <p>{checkmark} Facebook Added</p> : <p>Add Facebook</p>;
		var items = 
			[<li className="inactive-gray">{inactive_circle} {addPhoneText}</li>, 
				<li className="inactive-gray">{inactive_circle} {addEmailText}</li>, 
				<li className="inactive-gray">{inactive_circle} {addBioText}</li>];
		switch (s.activeScreen) {
			case "add_phone":
				items[0] = <li>{active_circle} {addPhoneText}</li>;
				prev = "";
				if (s.phoneAdded)
					next = cont;
				break;
			case "add_email":
				items[1] = <li>{active_circle} {addEmailText}</li>;
				if (s.emailAdded)
					next = cont;
				break;
			case "add_fb":
				items[1] = <li>{active_circle} {addFbText}</li>;
				if (s.fbAdded)
					next = cont;
				break;
			case "add_bio":
				items[2] = <li>{active_circle} {addBioText}</li>;
				if (s.bioAdded)
					next = complete_blue;
				else
					next = complete_gray;
				break;
			default:
				break;
		}
		return (
			<div className="row" id="account-setup">
				<div className="col-xs-3 col-sm-2">
					<ul className="nav-list">
						{items}
					</ul>
				</div>
				<div className="col-xs-8">
					<div id="carousel" className="carousel" data-ride="carousel" data-interval="false">
				        <div className="carousel-inner" id="carousel-pages" role="listbox">
							<div className="item active" id="add_phone">
			                    <AddPhone success={this.handleSuccess}/>
			                </div>		
			                <div className="item" id="add_email">
			                	<AddEmail success={this.handleSuccess}/>
			                </div>
			                <div className="item" id="add_bio">
			                	<AddBio success={this.handleSuccess}/>
			                </div>
			            </div>
			            <div className="row">
			            	<div className="col-xs-8 text-right">
			            		{prev}
			            		{next}
			            	</div>
			            </div>
				     </div>
				</div>
			</div>
		);
	}
});

// React.render(<AccountSetup />, document.getElementById("setup"));


