var React = require('react'),
    Modal = require('./modal.js'),
    FormSelectRow = require('./form_select_row.js'),
    FormTextRow = require('./form-row.js');
var DatesRow = React.createClass({
  getInitialState: function() {
    var d = this.props.data;
    // HAD TO COMMENT THIS SHIT FOR THE MOTHER FUCKUHZ Who DIDN'T GET IT THE FIRST TIME:
    // We clip this shit so that when the component mounts, you guys get that sweet sweet
    // FORMATTED GOSH DANG DATE!!!!!!! !!! !!! !1!! !!! !!
    return {Starts: d.Starts, Rsvp_by: d.Rsvp_by};
  },
  initDatepicker: function(picker_id, default_string) {
    var defaultDate = (default_string == "")? moment() : moment(default_string);
    $(picker_id).datetimepicker({sideBySide: true, defaultDate: defaultDate})
      .on('dp.change', this.setState({saveDisabled: false}));
  },
  componentDidMount: function() {
    this.initDatepicker('#Starts', this.state.Starts);
    this.initDatepicker('#Rsvp_by', this.state.Rsvp_by);
  },
  handleInputChanged: function(e) {
    console.log(e);
    var key = e.target.id,
        val = e.target.value,
        obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    return (<div>
        <FormTextRow 
          id="Starts"
          label="Meal Time"
          placeholder="When do you break bread?"
          defaultValue={this.state.Starts}
          handleInputChanged={this.handleInputChanged} />
        <FormTextRow 
          id="Rsvp_by"
          label="RSVP By"
          placeholder="Rsvp by?" 
          defaultValue={this.state.Rsvp_by}
          handleInputChanged={this.handleInputChanged} />
      </div>);
  }
});

var SeatsRow = React.createClass({
  getInitialState: function() {
    return {
      Capacity: 2
    };
  },
  handleInputChanged: function(e) {
    var key = e.target.id,
        val = e.target.value,
        obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    var s = this.state,
        possSeats = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    return (
      <div>
        <FormSelectRow 
          id="Capacity"
          handleInputChanged={this.handleInputChanged}
          options={possSeats}
          label="Capacity" />
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 col-md-2">
            <p className="form-label text-right">Max pay</p>
          </div>
          <div className="col-xs-7 col-sm-9">
            <p id="payout-val">{"$" + s.Capacity * this.props.price}</p>
          </div>
        </div>
      </div>);
 }
});

var AddressRow = React.createClass({
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value,
        obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  getInitialState: function() {
    var d = this.props.data;
    return ({
      Address: d.Address,
      City: d.City,
      State: d.State
    });
  },
  render: function() {
    var s = this.state,
        states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
    return (
      <div>
        <FormTextRow label="Street Address" 
          handleInputChanged={this.handleChange}
          placeholder="3700 O St"
          id="Address" />
        <FormTextRow label="City" 
          handleInputChanged={this.handleChange}
          placeholder="Washington"
          id="City" />
        <FormSelectRow 
          id="State"
          handleInputChanged={this.handleChange}
          options={states}
          label="State" />
      </div>
    );
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return {errors: [], success: false, Capacity: 2};
  },
  handleChange: function(obj) {
    console.log(obj);
    this.setState(obj);
  },
  createPopup: function() {
    var modalId = "#addPopup" + this.props.data.Id
    var api_data = this.state,
        starts = $(modalId).find('#Starts').data("DateTimePicker").date(),
        rsvpBy = $(modalId).find('#Rsvp_by').data("DateTimePicker").date(),
        errors = [];
    if (rsvpBy > starts) errors.push("Rsvp by time cannot be after meal starts.");
    if (rsvpBy < moment()) errors.push("Rsvp by time cannot be in the past.");
    if (starts < moment()) errors.push("Start time cannot be in the past.");
    if (api_data.Address.length < 1) errors.push("Address is required.");
    if (api_data.City.length < 1) errors.push("City is required.");
    this.setState({errors: errors});
    if (errors.length > 0)
      return;
    api_data["method"] = "createPopup",
    api_data["Session"] = Cookies.get("session"),
    api_data["MealId"] = this.props.data.Id,
    api_data["Starts"] = starts.unix(),
    api_data["Rsvp_by"] = rsvpBy.unix();
    var api_resp = api_call("meal", api_data);
    if (api_resp.Success){
      // show success
      this.setState({success: true});
      this.props.handleAddPopupSuccess(api_resp.Return);
    } else {
      // show error
      this.setState({errors: [api_resp.Error]});
    }
  },
  renderErrors: function() {
    var errors = this.state.errors;
    var errorItems = errors.map(function(error, i){
      return <li key={i}>{error}</li>;
    });
    return (
      <ul className="error-field">
        {errorItems}
      </ul>);
  },
  renderAddPopupForm: function() {
    var d = this.props.data,
        address = {Address: "", City: "", State: ""};
    return (
      <div className="row">
        <DatesRow handleChange={this.handleChange} data={d}/>
        <SeatsRow handleChange={this.handleChange} price={d.Price} />
        <AddressRow handleChange={this.handleChange} data={address}/>
        {this.renderErrors()}
        <div className="text-center">
          <button className="c-blue-bg" onClick={this.createPopup}>Submit</button>
        </div>
      </div>);
  },
  renderAddPopupSuccess: function() {
    return(
      <div className="row text-center">
        <h2>Popup Successfully added!</h2>
      </div>);
  },
  render: function() {
    var d = this.props.data;
    var modalBody = (this.state.success)?
      this.renderAddPopupSuccess() : this.renderAddPopupForm();
    return(
      <div>
        <button className="transparent-bg"             
          data-toggle="modal" 
          data-target={"#addPopup" + d.Id}><i className="fa fa-plus-circle"></i> Add Popup</button>
        <Modal 
          title={"New Popup for " + d.Title}
          body={modalBody}
          id={"addPopup" + d.Id}/>
      </div>);
  }
});