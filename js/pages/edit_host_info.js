var React = require('react');
var FormTextRow = require('../form-row.js');  
module.exports = React.createClass({
  getInitialState: function() {
  	return {
      address: '',
      state: '',
      city: '',
      saveDisabled: true};
  },
  handleStateChange: function(e) { // state as in Hawaii...
    state = e.target.value;
    enableSave();
    this.setState({state: e.target.value});
  },
  enableSave: function() {
    this.setState({saveDisabled: false});
  },
  handleInputChanged: function(e) {
    var obj = {},
        key = e.target.id,
        val = e.target.value;
    obj[key] = val;
    obj["saveDisabled"] = false;
    this.setState(obj);
  },
  attemptSendHostData: function() {
		console.log("attempting to send host data");
		var errors = [];
		if (!this.state.address) errors.push("Address is mandatory");
    if (!this.state.state) errors.push("State is mandatory");      
    if (!this.state.city) errors.push("City is mandatory");      
		if (errors.length === 0)
			this.sendHostData();
    this.setState({errors: errors});
  },
  sendHostData: function() {
    var api_resp = api_call('host', {
              method: 'updateHost',
              session: Cookies.get('session'),
              address: this.state.address,
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
        address: d.Address,
        city: d.City,
        state: d.State,
        stripe_connect: d.stripe_connect,
        saveDisabled: true,
        stripe_url: d.stripe_url,
        errors: []
      });
    } else
      this.setState({errors: ["Failed to load your host profile."]});
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
          placeholder="Tell us about yourself. Where are you from? Where have you been? What do you do? What food do you love?..."
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