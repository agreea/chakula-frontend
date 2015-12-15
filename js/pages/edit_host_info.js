var React = require('react');
var FormTextRow = React.createClass({
  getInitialState: function() {
      return ({value: this.props.default_value});
  },
  formChanged: function(e) {
    this.setState({value: e.target.value});
    this.props.handleInputChanged(e);
  },
  render: function() {
    return (<div className="row">
        <div className="col-xs-4 col-sm-2">
          <p className="text-right form-label">{this.props.form_name}</p>
        </div>
        <div className="col-sm-4 col-md-3 col-xs-8">
        <input className="text-field" id={this.props.id} type="text" 
          defaultValue={this.props.default_value} 
          onChange={this.formChanged}
          placeholder={this.props.placeholder}/>
        </div>
      </div>);
  }
});
  
module.exports = React.createClass({
  getInitialState: function() {
  	return {
      address: '',
      bio: '', 
      state: '',
      city: '',
      email: '',
      phone: '',
      saveDisabled: true};
  },
  bioChanged: function(e){
    bio = e.target.value;
    enableSave();
    this.setState({bio: e.target.value}); 
  },
  handleStateChange: function(e) {
    state = e.target.value;
    enableSave();
    this.setState({state: e.target.value});
  },
  enableSave: function() {
    this.setState({saveDisabled: false});
  },
  handleInputChanged: function(e) {
    var key = e.target.id;
    var val = e.target.value;
    this.setState({key: val});
    enableSave();
  },
  attemptSendHostData: function() {
		console.log("attempting to send host data");
		var errors = [];
		if (!this.state.email) {
			errors.push("Email is mandatory");
		}
		if (!this.state.phone) {
			errors.push("Phone is mandatory");
		}
		var reg = /^\d+$/;
		if (!reg.test(this.state.phone)) {
			errors.push("Phone must be digits only");
		} else if (phone.length != 10) {
			errors.push("Phone must be 10 digits long");
		}
		if (!this.state.address) {
			errors.push("Address is mandatory");
		}
    if (!this.state.state) {
      errors.push("State is mandatory");      
    }
    if (!this.state.city) {
      errors.push("City is mandatory");      
    }
		if (!Cookies.get('session')) {
			// show fb login
		}
		if (errors.length === 0) {
			this.sendHostData();
		} else {
      this.setState({errors: errors});
		}
  },
  sendHostData: function() {
    var api_resp = api_call('host', {
              method: 'updateHost',
              session: Cookies.get('session'),
              email: this.state.email,
              phone: this.state.phone,
              address: this.state.address,
              bio: this.state.bio,
              state: this.state.state,
              city: this.state.city
              });
    console.log("Sent host data");
    console.log(api_resp);
    if (api_resp.Success) {
      this.setState({saveDisabled: true, errors: []});
      // show the saved button as green, add check mark, disable
    }
  },
  componentWillMount: function() {
    var api_resp = api_call('host', {method: 'getHost', session: Cookies.get('session')});
    if (api_resp.Success) {
      var d = api_resp.Return;
      this.setState({
        email: d.Email,
        address: d.Address,
        phone: d.Phone,
        city: d.City,
        state: d.State,
        bio: d.Bio,
        stripe_connect: d.stripe_connect,
        saveDisabled: true,
        stripe_url: d.stripe_url,
        errors: []
      });
    } else {
      this.setState({errors: ["Failed to load your host profile."]});
    }
  },
  render: function() {
  	var stripe_element;
  	var host = this.state;
  	if (host.stripe_connect) {
  		stripe_element = 
        (<p><span className='glyphicon glyphicon-ok' aria-hidden='true'></span> Stripe Connected</p>);
  	} else if(host.email && host.phone && host.address){
    		stripe_element = 
          (<a className="stripe-btn btn-lg btn"
            	href={host.stripe_url} 
            	target="_blank">Connect With Stripe</a>);
  	} else {
  		stripe_element = (<p>Complete and save the information above to set up payments</p>);
  	}
    var states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
    var states_select_options = states.map(function(state) { return <option value={state}>{state}</option>;});
    return (
      <div className="row" id="edit-host-info">
    	 <div className="row">
    	    <div className="col-xs-offset-4 col-sm-offset-2">
    	    	<h3>Your Host Profile</h3>
            <span className="disclaimer-text">By setting up an account you agree to <b><a target="_blank" href="https://yaychakula.com/tos.html">the Chakula terms of service</a></b></span>
    		  </div>
    	 </div>
      <FormTextRow form_name="Email" 
        place_holder="One you actually check" 
        id="email" 
        handleInputChanged={this.handleInputChanged}
        default_value={host.email}/>
      <FormTextRow form_name="Phone #" 
        place_holder="01234567890" 
        id="phone"
        default_value={host.phone}
        handleInputChanged={this.handleInputChanged}/>
      <FormTextRow form_name="Address" 
        place_holder="3700 O St NW" 
        id="address"
        default_value={host.address}
        handleInputChanged={this.handleInputChanged}/>
      <FormTextRow form_name="City" 
        place_holder="Washington" 
        id="city"
        default_value={host.city}
        handleInputChanged={this.handleInputChanged}/>
      <div className="row">
      <div className="col-xs-4 col-sm-2">
        <p className="text-right form-label">State</p>
      </div>
      <div className="col-xs-8 col-sm-6">
        <select className="state-select" value={host.State} onChange={this.handleStateChange}>
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
          defaultValue={host.bio} onChange={this.bioChanged}></textarea>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-sm-offset-2 col-xs-6 col-xs-offset-4">
          <button type="button" className="brand-btn btn-info btn-lg btn" id="save" 
            onClick={this.attemptSendHostData} disabled={host.saveDisabled}>{(host.saveDisabled) ? "Saved" : "Save"}</button>
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
    </div>);}
  });