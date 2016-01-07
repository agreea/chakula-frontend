var React = require('react'),
    FormTextRow = require('../form-row.js'),
    Link = require('react-router').Link;  
module.exports = React.createClass({
  getInitialState: function() {
  	return {
      address: '',
      state: '',
      city: '',
      saveDisabled: true};
  },
  handleStateChange: function(e) { // state as in Hawaii...
    console.log(e);
    state = e.target.value;
    this.setState({state: state, saveDisabled: false});
    console.log(this.state.state);
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
    var data = this.state;
    data["method"] = "updateHost";
    data["session"] = Cookies.get("session");
    var api_resp = api_call('host', data);
    if (api_resp.Success){
      api_resp["saveDisabled"] = true,
      api_resp["errors"] = [];
      this.setState(api_resp);
    }
    // show the saved button as green, add check mark, disable
  },
  componentWillMount: function() {
    var get_guest = api_call('kitchenuser', {method: 'get', session: Cookies.get('session')});
    if (!get_guest.Success || 
        !get_guest.Return.First_name ||
        !get_guest.Return.Last_name ||
        !get_guest.Return.Phone ||
        !get_guest.Return.Email)
      this.setState({needsGuestInfo: true});
    var api_resp = api_call('host', {method: 'getHost', session: Cookies.get('session')});
    if (api_resp.Success) {
      var d = api_resp.Return;
      d["saveDisabled"] = true;
      d["errors"] = [];
      this.setState(d);
    } else
      this.setState({errors: [api_resp.Error]});
  },
  renderStripeElement: function() {
    var host = this.state;
    if (host.Stripe_connect){ // if the host has already connected w stripe show they're good 2 go
      return (<p><span className='glyphicon glyphicon-ok' aria-hidden='true'></span> Stripe Connected</p>);
    } else if(!host.Address || !host.City || !host.State){ // if they don't have their address set up, let them know
      return (<p>Complete and save the information above to set up payments</p>);
    } else if (host.needsGuestInfo){ 
      return (<Link to={"edit_guest_info?stripe_redir=" + encodeURIComponent(host.Stripe_url)}>
          <p>Click here to complete your guest profile and return to set up payments</p> 
          </Link>);
    } else {
      return (<a className="stripe-btn btn-lg btn"
            href={host.Stripe_url} 
            target="_blank">Connect With Stripe</a>);
    }
  },
  render: function() {
  	var host = this.state;
    var header_title = (this.props.location.query.create)? "Create Your Chef Profile" : "Your Chef Profile";
    var header = 
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">
          <h3>{header_title}</h3>
          <span className="disclaimer-text">By setting up an account you agree to <b><a target="_blank" href="https://yaychakula.com/tos.html">the Chakula terms of service</a></b></span>
        </div>
      </div>;
    if (host.errors.length > 0 && host.errors[0].indexOf("Could not locate your") > -1) {
      return (
        <div className="row" id="edit-host-info">
          {header}
          <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">
            <p className="banner warning-yellow-bg">
              {host.errors[0]}
            </p>
            <Link to="edit_guest_info">
              <button className="c-blue-bg">
                Fix Now
              </button>
            </Link>
          </div>
        </div>);
    }
    var states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
    var states_select_options = states.map(function(state) { return <option value={state}>{state}</option>;});
    return (
      <div className="row" id="edit-host-info">
        {header}
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
            <FormTextRow form_name="Address" 
              place_holder="3700 O St NW" 
              id="address"
              default_value={host.Address}
              handleInputChanged={this.handleInputChanged}/>
            <FormTextRow form_name="City" 
              place_holder="Washington" 
              id="city"
              default_value={host.City}
              handleInputChanged={this.handleInputChanged}/>
            <div className="row">
            <div className="col-xs-4 col-sm-3">
              <p className="text-right form-label">State</p>
            </div>
            <div className="col-xs-8 col-md-5">
              <select className="state-select" value={host.state} onChange={this.handleStateChange}>
                {states_select_options}
              </select>
            </div>
            </div>
            <div className="row error-field">
              <ul>
                {this.state.errors.map(function(error) {
                  return <li>{error}</li>;
                })}
              </ul>
            </div>
            <div className="row">
              <div className="col-xs-4 col-xs-offset-4 col-sm-offset-3">
                <button type="button" className="brand-btn btn-info btn-lg btn" id="save" 
                  onClick={this.attemptSendHostData} disabled={host.saveDisabled}>{(host.saveDisabled) ? "Saved" : "Save"}</button>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-4 col-sm-3">
                <p className="text-right form-label">Payment</p>
              </div>
              <div className="col-xs-8 col-sm-6">
                {this.renderStripeElement()}
              </div>
              <ul className="warning-field" id="stripe-warning">
              </ul>
            </div>
          </div>
        </div>
      </div>);}
  });