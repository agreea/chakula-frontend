var React = require('react');
var FormTextRow = require('../form-row.js');  
var AddPhone = require('../add_phone.js');
var Modal = require('../modal.js');
module.exports = React.createClass({
  getInitialState: function() {
  	return {
      firstName: '',
      lastName: '',
      bio: '', 
      email: '',
      phone: '',
      saveDisabled: true};
  },
  bioChanged: function(e){
    bio = e.target.value;
    this.setState({Bio: e.target.value, saveDisabled: false}); 
  },
  enableSave: function() {
    this.setState({saveDisabled: false});
  },
  handleInputChanged: function(e) {
    var obj = {saveDisabled: false},
        key = e.target.id,
        val = e.target.value;
    obj[key] = val;
    this.setState(obj);
  },
  attemptSendGuestData: function() {
		console.log("attempting to send guest data");
		var errors = [];
		if (!this.state.Email) errors.push("Email is mandatory");
    if (!this.state.First_name) errors.push("First name is mandatory");
    if (!this.state.Last_name) errors.push("Last name is mandatory");
		if (errors.length > 0)
      this.setState({errors: errors});
    else
      this.sendGuestData();
  },
  sendGuestData: function() {
    var data = this.state;
    data["method"] = 'updateGuest';
    data["session"] = Cookies.get("session");
    var api_resp = api_call('kitchenuser', data);
    console.log(api_resp);
    if (api_resp.Success) {
      data["saveDisabled"] = true;
      data["errors"] = [];
      data["saveSuccess"] = true;
    } 
    this.setState(data);
  },
  addPhoneSuccess: function() {
    // idk MAN IDK FUCKING K
  },
  componentWillMount: function() {
    var api_resp = api_call('kitchenuser', {method: 'getForEdit', session: Cookies.get('session')});
    if (api_resp.Success) {
      var d = api_resp.Return;
      d["saveDisabled"] = true;
      d["errors"] = [];
      this.setState(d);
    } else {
      this.setState({errors: ["Failed to load your guest profile."]});
    }
  },
  componentDidUpdate: function() { // called after successful saves
    // if this instance is was a redirect from host setup, show the modal to link them to stripe
    if(this.props.location.query.stripe_redir && this.state.saveSuccess)
      $('#stripe-modal').modal('show');
  },
  render: function() {
  	var stripe_element;
  	var guest = this.state;
    var stripeModalBody;
    if(guest.saveSuccess && this.props.location.query.stripe_redir)
      stripeModalBody = 
      <div className="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4">
        <a href={this.props.location.query.stripe_redir}
          className="brand-btn" 
          target="_blank">Set up Stripe Payments</a>
      </div>;
    return (
      <div className="row" id="edit-host-info">
    	 <div className="row">
    	    <div className="col-xs-offset-4 col-sm-offset-2">
    	    	<h3>Your Guest Profile</h3>
            <span className="disclaimer-text">By setting up an account you agree to <b><a target="_blank" href="https://yaychakula.com/tos.html">the Chakula terms of service</a></b></span>
    		  </div>
    	 </div>
      <FormTextRow form_name="First Name" 
        place_holder="John" 
        id="First_name" 
        handleInputChanged={this.handleInputChanged}
        default_value={guest.First_name}/>
      <FormTextRow form_name="Last Name" 
        place_holder="Doe" 
        id="Last_name" 
        handleInputChanged={this.handleInputChanged}
        default_value={guest.Last_name}/>
      <FormTextRow form_name="Email" 
        place_holder="One you actually check" 
        id="Email" 
        handleInputChanged={this.handleInputChanged}
        default_value={guest.Email}/>
      <div className="row">
        <div className="col-sm-2 col-xs-4">
          <p className="form-label text-right">Phone</p>
        </div>
        <div className="col-xs-8 col-sm-6">
          <AddPhone phone={guest.Phone} success={this.addPhoneSuccess}/>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2 col-xs-4">
        	<p className="form-label text-right">Bio</p>
        </div>
      <div className="col-xs-8 col-sm-6">
        <textarea className="text-field" id="Bio" rows="6"
          placeholder="Tell us about yourself. Where are you from? Where have you been? What do you do? What food do you love?..."
          defaultValue={guest.Bio} onChange={this.bioChanged}></textarea>
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
        <div className="col-sm-6 col-sm-offset-2 col-xs-6 col-xs-offset-4">
          <button type="button" className="brand-btn btn-info btn-lg btn" id="save" 
            onClick={this.attemptSendGuestData} disabled={guest.saveDisabled}>{(guest.saveDisabled) ? "Saved" : "Save"}</button>
        </div>
      </div>
      <Modal id="stripe-modal" body={stripeModalBody} title={"Ready to Connect With Stripe"}></Modal>
    </div>);}
  });