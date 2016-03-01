var React = require('react'),
    FormTextRow = require('../form-row.js'),  
    AddPhone = require('../add_phone.js'),
    Modal = require('../modal.js'),
    AddCard = require('../add_card.js'),
    Link = require('react-router').Link;
var Cards = React.createClass({
  getInitialState: function() {
    return {
      addCardPressed: false, 
      cards: this.props.data.Last4s
    };
  },
  handleAddCardPressed: function(){
    this.setState({addCardPressed: true});
  },
  handleAddCardSuccess: function(last4){
    var cards = this.state.cards;
    cards.push(last4);
    this.setState({handleAddCardPressed: false, cards: cards});
  },
  renderCards: function() {
    var cards = this.state.cards;
    cardNodes = cards.map(function(card, index){
      return <p key={index}>{"..." + card}</p>;
    });
    return <div>{cardNodes}</div>;
  },
  render: function() {
    var addCard = (this.state.addCardPressed)?
      <AddCard handleAddCardSuccess={this.handleAddCardSuccess}/> : 
      <button className="c-blue-bg" onClick={this.handleAddCardPressed}>Add Card</button>
    return(<div className="text-left col-xs-8 col-md-6 col-xs-offset-4 col-sm-offset-3">
        <h4>Your Cards</h4>
        {this.renderCards()}
        {addCard}
      </div>)
  }
});
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
  renderLogin: function() {
    return(
      <div className="row" id="edit-host-info">
        <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">
          <h2>Log in To Chakula to Access Your Profile</h2>
          <div className="text-center">
            <Link to="/login?fwd=edit_guest_info">
              <button className="brand-btn c-blue-bg text-center">Login</button>
            </Link>
          </div>
        </div>
      </div>
      )
  },
  render: function() {
    if (!Cookies.get("session"))
      return this.renderLogin();
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
       <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 text-center">
        <h3>Your Guest Profile</h3>
        <span className="disclaimer-text">By setting up an account you agree to <b><a target="_blank" href="https://yaychakula.com/tos.html">the Chakula terms of service</a></b></span>
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
          <div className="col-xs-4 col-sm-3">
            <p className="form-label text-right">Phone</p>
          </div>
          <div className="col-xs-8 col-md-5">
            <AddPhone phone={(guest.Phone == 0)? "" : guest.Phone} 
              success={this.addPhoneSuccess}
              verified={guest.Phone_verified} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-4 col-sm-3">
            <p className="form-label text-right">Bio</p>
          </div>
        <div className="col-xs-8 col-md-6">
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
        <Cards data={this.state}/>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-4">
            <button type="button" className="brand-btn btn-info btn-lg btn" id="save" 
              onClick={this.attemptSendGuestData} disabled={guest.saveDisabled}>{(guest.saveDisabled) ? "Saved" : "Save"}</button>
          </div>
        </div>
      </div>
      <Modal id="stripe-modal" body={stripeModalBody} title={"Ready to Connect With Stripe"}></Modal>
    </div>);}
});