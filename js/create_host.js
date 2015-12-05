var phone = "";
var address = "";
var email = "";
var bio = "";
var state = "";
var city = "";
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
    } else if (this.props.id === "city") {
      city = e.target.value;
    } else if (this.props.id === "state") {
      state = e.target.value;
    }
    this.setState({value: e.target.value});
    enableSave();
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
  	return {Bio: this.props.data.Bio, State: this.props.data.State};
  },
  bioChanged: function(e){
    bio = e.target.value;
    enableSave();
    this.setState({Bio: e.target.value}); 
  },
  handleStateChange: function(e) {
    state = e.target.value;
    enableSave();
    this.setState({State: e.target.value});
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
			submittable = false;
			errorHtml += "<li>Phone must be digits only</li>"
		} else if (phone.length != 10) {
			submittable = false;
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
  	var stripe_element;
  	var host = this.props.data;
  	if (host.Stripe_connect) {
  		stripe_element = (<p><span className='glyphicon glyphicon-ok' aria-hidden='true'></span> Stripe Connected</p>);
  	} else if(host.Email && host.Phone && host.Address){
    		stripe_element = (<a className="stripe-btn btn-lg btn" 
            	href={host.Stripe_url} 
            	target="_blank">Connect With Stripe</a>);
  	} else {
  		stripe_element = (<p>Complete the information above to set up payments</p>);
  	}
    var states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
    var states_select_options = states.map(function(state) {
      return <option value={state}>{state}</option>;
    });
    return (
      <div className="row">
    	 <div className="row">
    	    <div className="col-xs-offset-4 col-sm-offset-2">
    	    	<h3>Your Host Profile</h3>
    		  </div>
    	 </div>
      <FormTextRow form_name="Email" place_holder="One you actually check" id="email" default_value={host.Email}/>
              <FormTextRow form_name="Phone #" 
                place_holder="01234567890" 
                id="phone"
                default_value={host.Phone}/>
              <FormTextRow form_name="Address" 
                place_holder="3700 O St NW" 
                id="address"
                default_value={host.Address}/>
              <FormTextRow form_name="City" 
                place_holder="Washington" 
                id="city"
                default_value={host.City}/>
              <div className="row">
                <div className="col-xs-4 col-sm-2">
                  <p className="text-right form-label">State</p>
                </div>
                <div className="col-xs-8 col-sm-6">
                  <select value={host.State} onChange={this.handleStateChange}>
                    {states_select_options}
                  </select>
                </div>
              </div>
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
               		<button type="button" className="brand-btn btn-info btn-lg btn" id="save" 
               		 onClick={this.attemptSendHostData}>Saved</button>
               	</div>
              </div>
              <div className="row">
                <div className="col-xs-4 col-sm-2">
                  <p className="text-right form-label">Payment</p>
                </div>
                <div className="col-xs-6 col-sm-4">
                	{stripe_element}
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
						bio: bio,
            state: state,
            city: city
						});
	console.log("Sent host data");
	console.log(api_resp);
	if (api_resp.Success) {
	   create_host_render(api_resp.Return);
	   $('#error-field').hide();
     // disable save
     $('#save').css('background-color', '#19a347');
     $('#save').text('Saved');
		// show the saved button as green, add check mark, disable
	}
}
function enableSave(){
  $('#save').prop("disabled", false);
  $('#save').css("background-color", '#5bc0de');
  $('#save').text("Save");
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