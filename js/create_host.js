      var phone = "";
      var address = "";
      var email = "";
      var bio = "";
      var FormTextRow = React.createClass({
        getInitialState: function() {
    	      return ({value: this.props.default_value});
        },
        formChanged: function(e) {
        	if (this.props.id === "phone") {
        		phone = e.target.value;
        		console.log('Phone: ' + phone);
        	} else if (this.props.id === "email") {
        		email = e.target.value;
        	        		console.log('Email: ' + email);

        	} else if (this.props.id === "address") {
        		address = e.target.value;
        		        		console.log('Address: ' + address);

        	}
	          this.setState({value: e.target.value});
        },
        render: function() {
          return (<div className="row">
              <div className="col-xs-4 col-sm-2 form-label">
                <p className="text-right">{this.props.form_name}</p>
              </div>
              <div className="col-sm-4 col-xs-8">
              <input className="text-field" id={this.props.id} type="text" 
                defaultValue={this.props.default_value} 
                onChange={this.formChanged}
                placeholder={this.props.placeholder}/>
              </div>
            </div>);
        }
      });
      
      var ProfileForm = React.createClass({
        getInitialState: function() {
        	return {Bio: this.props.data.Bio};
        },
        bioChanged: function(e){
          bio = e.target.value;
          this.setState({Bio: e.target.value}); 
        },
        attemptSendHostData: function() {
			console.log("attempting to send host data");
			var submittable = true;
			var errorHtml = ""
			if (!email) {
				submittable = false;
				errorHtml += "<li>Email is mandatory</li>"
			}
			if (!phone) {
				submittable = false;
				errorHtml += "<li>Phone is mandatory</li>"
			}
			var reg = /^\d+$/;
			if (!reg.test(phone)) {
				errorHtml += "<li>Phone must be digits only</li>"
			} else if (!phone.length !== 10) {
				errorHtml += "<li>Phone must be 10 digits long</li>"
			}
			if (!address) {
				submittable = false;
				errorHtml += "<li>Address is mandatory</li>"
			}
			if (!Cookies.get('session')) {
				// show fb login
				submittable = false;
			}
			if (submittable) {
				console.log("Submitting");
				sendHostData();
			} else {
				$('#error-field').html(errorHtml);
			}
        },
        render: function() {
          return (<div className="row">
          	<h3 className="text-center">Your Host Profile</h3>
              <FormTextRow form_name="Email" 
                place_holder="One you actually check" 
                id="email"
                default_value={this.props.data.Email}/>
              <FormTextRow form_name="Phone #" 
                place_holder="01234567890" 
                id="phone"
                default_value={this.props.data.Phone}/>
              <FormTextRow form_name="Address" 
                place_holder="3700 O St NW" 
                id="address"
                default_value={this.props.data.Address}/>
              <div className="row">
              	<div className="col-sm-2 col-xs-4">
              		<p className="form-label text-right">Bio</p>
              	</div>
              	<div className="col-xs-8 col-sm-6">
              		<textarea className="text-field" id="bio" rows="6"
                    	placeholder="Tell us about yourself. Do you like candle-lit dinners, long walks on the beach?..."
                    	defaultValue={this.state.Bio} onChange={this.bioChanged}></textarea>
                </div>
              </div>
              <div className="row">
               	<div className="col-sm-6 col-sm-offset-2 col-xs-6 col-xs-offset-4">
               		<button type="button" className="brand-btn btn-info btn-lg btn" 
               		onClick={this.attemptSendHostData}>Save</button>
               	</div>
              </div>
              <div className="row">
                <div className="col-xs-4 col-sm-2">
                  <p className="text-right form-label">Payment</p>
                </div>
                <div className="col-xs-6 col-sm-4">
                  <a className="stripe-btn btn-lg btn" 
                  	href="https://connect.stripe.com/oauth/authorize?response_type=code&amp;client_id=ca_6n8She3UUNpFgbv1sYtB28b6Db7sTLY6&amp;scope=read_write" 
                  	target="_blank">Connect With Stripe</a>
                </div>
                <ul className="warning-field" id="stripe-warning">
                </ul>
              </div>
            </div>);
        }
      });

function create_host_render(host) {
    React.render(
    	<ProfileForm data={host}/>,
        document.getElementById('host-data'));
}

function sendHostData() {
	var api_resp = api_call('host', {
						method: 'updateHost',
						session: Cookies.get('session'),
						email: email,
						phone: phone,
						address: address,
						bio: bio
						});
	console.log("Sent host data");
	console.log(api_resp);
	if (api_resp.Success) {
		var $host_data = $('.host-data');
	  	$host_data.find('.brand-btn').prop('disabled', true);
	    $host_data.find('.brand-btn').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Saved");
	    $host_data.find('.brand-btn').css("background-color", "#19a347");
	    $host_data.find('.brand-btn').css("color", "#fff");
	    $('#error-field').hide();
		// show the saved button as green, add check mark, disable
	}
}

if (!Cookies.get('session')) {
  window.location.replace("http://yaychakula.com");
}

var api_resp = api_call('host', {method: 'getHost', session: Cookies.get('session')});
if (api_resp.Success) {
	email = api_resp.Return.Email;
	phone = api_resp.Return.Phone;
	address = api_resp.Return.Address;
	create_host_render(api_resp.Return);
}
create_host_render(api_resp.Return);