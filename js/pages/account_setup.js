var React = require('react');
var AddPhone = require('../add_phone.js');
var AddEmail = React.createClass({
	getInitialState: function(){
		return {email: this.props.email}
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
	handlePhotoUpload: function(e){
	    console.log(e);
	    var file = e.target.files[0];
	    if (!/image.*/.test(file.type)) {
	        return;
	    }
	    var reader = new FileReader();
	    reader.onload = this.onload;
	    reader.readAsDataURL(file);
	},
	onload: function(e){
	    var img = document.createElement("img");
	    var component = this;
	    img.onload = function(event) {
	      var canvas = document.createElement("canvas");
	      var MAX_WIDTH = 350;
	      var MAX_HEIGHT = 350;
	      var width = img.width;
	      var height = img.height;
	      if (width > height && width > MAX_WIDTH) { // if landscape, resize by landscape
	        height *= MAX_WIDTH / width;
	        width = MAX_WIDTH;
	      } else if (height > MAX_HEIGHT) { // if portrait, resize by portrait
	          width *= MAX_HEIGHT / height;
	          height = MAX_HEIGHT;
	   	  }
	      canvas.width = width;
	      canvas.height = height;
	      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
	      component.uploadPhotoToServer(canvas.toDataURL("image/jpeg"));
	    };
		img.src = e.target.result;
	},
	uploadPhotoToServer: function(pic){
		var api_resp = api_call("kitchenuser", {
			method: "updateProfPic",
			session: Cookies.get("session"),
			pic: pic
		});
		if (api_resp.Success){
			this.setState({src: api_resp.Return});
			this.props.success("photoAdded");
		} else
			this.setState({errors: [api_resp.Error]});
	},
	componentDidUpdate: function() {
		this.updateDefaultPic();
	},
	componentDidMount: function() {
		this.updateDefaultPic();
	},
	updateDefaultPic: function() { 
		// resolves updates in parent state communicated through changes in props with local state.
		if(this.state.src === "img/user-icon.svg" && 
			this.props.pic !== "img/user-icon.svg")
			this.setState({src: this.props.pic});
	},
	getInitialState: function() {
		return({src: this.props.pic, errors: []})
	},
	render: function(){
		var style = {maxHeight: "250px"};
		return (
			<div className="col-xs-8">
				<h3>Add a Photo</h3>
				<p>{"Adding a photo of yourself helps our hosts get an idea of who they're welcoming into their homes."}</p>
				<p>{"If you've connected Chakula with Facebook, we've included your profile picture below"}</p>
				<img className="img-responsive img-responsive-center"
					src={this.state.src}
					style={style}/>
				<div className="row text-center">
			        <div className="upload-img-form">
			          <div className="fileUpload btn-upload btn btn-primary">
			            <span>Upload Picture</span>
			            <input className="upload" id="img-upload" type="file" multiple onChange={this.handlePhotoUpload}/>
			          </div>
			        </div>
			    </div>
			</div>);
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
							placeholder="Write from the first person please! Where do you work? Where are you from? What are your hobbies?" 
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
var AddFb = React.createClass({
	getInitialState: function() {
		return {connected: false, errors: []}
	},
	handleFbLogin: function() {
    	FB.login(this.fbResponseHandler, { scope: 'public_profile, email'});
    },
	fbResponseHandler: function(response) {
        if (response.authResponse) {
          var accessToken = response.authResponse.accessToken, //get access token
              userId = response.authResponse.userID; //get FB UID
          var api_resp = api_call('kitchenuser', 
            {
            	method: 'FbConnect', 
            	fbToken: accessToken,
            	session: Cookies.get("session")
        	});
          if (api_resp.Success) {
          	this.setState({connected: true});
          	this.props.success(userId);
          }
      } else {
        this.setState({errors:["Facebook login failed."]});
      }
	},
	render: function() {
		var s = this.state;
		return(
			<div className="col-xs-8">
				<h3>Connect with Facebook</h3>
				<p>Connecting your Facebook account helps us set up your identity and allows us to use your profile picture </p>
				<div>
				{(s.connected)?
					<button className="active-green-bg" disabled="true"><i className="fa fa-check"></i> Facebook Connected</button> :
					<img className="fb-login" onClick={this.handleFbLogin} src="./img/fb-login.svg" id="fb"></img>
				}
				</div>
				<ul className="error-field">
					{(s.errors)? 
						s.errors.map(function(error){return <li>{error}</li>}) : ""}
				</ul>
			</div>
		);
	}
})
module.exports = React.createClass({
	handleSuccess: function(field_key){
		var obj = {};
		obj[field_key] = true;
		this.setState(obj);
	},
	handleFacebookAdded: function(fbId){
		this.setState({fbId: fbId, fbAdded: true});
		console.log(this.state.fbId);
	},
	carouselPressed: function() {
		this.setState({activeScreen: $(".active").attr('id')});
	},
	complete: function() {
        this.history.pushState(null, this.props.location.query.fwd);
	},
	getInitialState: function() {
		return({activeScreen: (this.props.fbLogin)? "add_email" : "add_fb", fbId: this.props.location.query.fbId});
	},
	componentWillMount: function() {
		this.setState({
			fbId: this.props.location.query.fbId,
			fbEmail: this.props.location.query.fbEmail,
			fbLogin: this.props.location.query.fbLogin
		});
	},
	render: function(){
		var style = {"marginTop":"52px"},
			s = this.state;
		// navigation components
		var inactive_circle = <i className="fa fa-circle-o inactive-gray"></i>,
			active_circle = <i className="fa fa-circle active-green"></i>,
			prev = <a href="#carousel" role="button" data-slide="prev" id="prev">
					<button onClick={this.carouselPressed} className="caro-nav">Previous</button></a>,
			next = <a href="#carousel" role="button" data-slide="next" id="next">
					<button onClick={this.carouselPressed} className="caro-nav">Skip</button></a>,
			cont = <a href="#carousel" role="button" data-slide="next" id="next">
					<button onClick={this.carouselPressed} className="c-blue-bg caro-nav">Continue</button></a>;		
		var checkmark = <i className="fa fa-check active-green"></i>;

		var addPhoneText = (s.phoneAdded)? <p>{checkmark} Phone Added</p> : <p>Add Phone</p>,
			addEmailText = (s.emailAdded)? <p>{checkmark} Email Added</p> : <p>Add Email</p>,
			addBioText = (s.bioAdded)? <p>{checkmark} Bio Added</p> : <p>Add Bio</p>,
			addFbText = (s.fbAdded)? <p>{checkmark} FB Added</p> : <p>Add FB</p>,
			addPhotoText = (s.photoAdded)? <p>{checkmark} Photo Added</p> : <p>Add Photo</p>;
		var items = 
			[<li className="inactive-gray">{inactive_circle} {(s.fbLogin)? addEmailText : addFbText}</li>,
				<li className="inactive-gray">{inactive_circle} {addPhoneText}</li>,
				<li className="inactive-gray">{inactive_circle} {addPhotoText}</li>, 
				<li className="inactive-gray">{inactive_circle} {addBioText}</li>];
		switch (s.activeScreen) {
			case "add_email":
				items[0] = <li>{active_circle} <b>{addEmailText}</b></li>;
				prev = "";
				if (s.emailAdded)
					next = cont;
				break;
			case "add_fb":
				items[0] = <li>{active_circle} <b>{addFbText}</b></li>;
				prev = "";
				if (s.fbAdded)
					next = cont;
				break;			
			case "add_phone":
				items[1] = <li>{active_circle} <b>{addPhoneText}</b></li>;
				if (s.phoneAdded)
					next = cont;
				break;
			case "add_photo":
				items[2] = <li>{active_circle} <b>{addPhotoText}</b></li>;
				if (s.photoAdded)
					next = cont;
				break;
			case "add_bio":
				items[3] = <li>{active_circle} <b>{addBioText}</b></li>;
				next = 
					<button onClick={this.complete} 
						className={"caro-nav" + (s.bioAdded)? " c-blue-bg" : ""}>Continue</button>;
				break;
			default:
				break;
		}
		console.log(s.fbId);
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
							{(s.fbLogin)?
					            <div className="item active" id="add_email">
					               	<AddEmail 
					               		success={this.handleSuccess}
					               		email={s.fbEmail}/>
					            </div> :
					            <div className="item active" id="add_fb">
					               	<AddFb success={this.handleFacebookAdded}/>
				                </div>
			                }	
							<div className="item" id="add_phone">
								<div className="col-xs-8">
									<h3>Add Phone</h3>
									<p>Verifying your phone number will help confirm your identity and 
										allow us to send you real time updates about the meals you attend.</p>
				                    <AddPhone success={this.handleSuccess}/>
				                </div>
			                </div>
			                <div className="item" id="add_photo">
			                	<AddPhoto 
			                		pic={(s.fbId)?
			                			"https://graph.facebook.com/" + s.fbId + "/picture?width=500&height=500" :
			                			"img/user-icon.svg"
			                		}
			                		success={this.handleSuccess}/>
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