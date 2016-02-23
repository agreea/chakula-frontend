var React = require('react');
var Link = require('react-router').Link,
    Modal = require('../modal.js');

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
  handleChange: function(e) {
    console.log(e);
    var key = e.target.id,
        val = e.target.value,
        obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    var s = this.state;
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">Meal Time</p>
          </div>
          <div className="col-xs-7">
            <input className="text-field" type="text" size="20" id={"Starts"}
              placeholder="When do you break bread?" 
              value={s.Starts}
              onChange={this.handleChange}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">RSVP By</p>
          </div>
          <div className="col-xs-7">
            <input className="text-field" type="text" size="40" id={"Rsvp_by"}
              placeholder="Rsvp by?" 
              value={s.Rsvp_by} 
              onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    );
  }
});

var SeatsRow = React.createClass({
  getInitialState: function() {
    return {
      Capacity: 2
    };
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value,
        obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    var s = this.state;
    var possSeats = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">Guest Seats</p>
          </div>
          <div className="col-xs-2 col-sm-1">
            <select value={s.Capacity} className="border-btn" id="Capacity" onChange={this.handleChange}>
              {possSeats.map(function(seat_count, i) {
                  return <option value={seat_count} key={i}>{seat_count}</option>;})
              }
            </select>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">Max pay</p>
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
    var s = this.state;
    var states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];
    var states_select_options = states.map(function(state) { return <option value={state}>{state}</option>;});
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">Street Address</p>
          </div>
          <div className="col-xs-7">
            <div className="text-field">
              <input className="text-field" id="Address" type="text" 
                value={s.Address} 
                placeholder="3700 O St"
                onChange={this.handleChange}/>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">City</p>
          </div>
          <div className="col-xs-7">
            <div className="text-field">
              <input className="text-field" id="City" type="text" 
                value={s.City} 
                placeholder="Washington"
                onChange={this.handleChange}/>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-5 col-sm-3 form-label">
            <p className="text-right">State</p>
          </div>
          <div className="col-xs-7">
            <select className="state-select border-btn" value={s.State} id="State" onChange={this.handleChange}>
              {states_select_options}
            </select>
          </div>
        </div>
      </div>
    );
  }
});

var AddPopupRow = React.createClass({
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
  render: function() {
    var address = {Address: "", City: "", State: ""};
    var d = this.props.data;
    var modalBody = (this.state.success)?
      <div className="row text-center">
        <h2>Popup Successfully added!</h2>
      </div> :
      <div className="row">
        <DatesRow handleChange={this.handleChange} data={d}/>
        <SeatsRow handleChange={this.handleChange} price={d.Price} />
        <AddressRow handleChange={this.handleChange} data={address}/>
        {this.renderErrors()}
        <div className="text-center">
          <button className="c-blue-bg" onClick={this.createPopup}>Submit</button>
        </div>
      </div>;
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

var PopupRow = React.createClass({
  getInitialState: function() {
    return {moreClicked: false};
  },
  handleMoreClicked: function() { // simple switch
    var moreClicked = this.state.moreClicked;
    this.setState({moreClicked: !moreClicked});
  },
  renderAttendeeRows: function(attNodes) {
    var attendeeRows = [], // two dimensional array. Each row contains 3 pic items
        thisRow = []; // second dimension of the array. Once a row stores 3 pics, you add it to the pic rows
    for (var i in attNodes) {
      // add this row to pic rows if it's full
      if (thisRow.length === 4) {
        var fullRow = thisRow;
        attendeeRows.push(<div className="row">{fullRow}</div>);
        thisRow = []; // empty the array
      }
      thisRow.push(attNodes[i]);
      if (i == (attNodes.length - 1)) { // if this is the last pic, add the current row once you've added the pic
        attendeeRows.push(<div className="row">{thisRow}</div>);
      }
    }
    return attendeeRows;
  },
  renderAttendees: function() {
    var attendees = this.props.data.Attendees;
    var attNodes = attendees.map(function(attendee, i) {
      console.log(attendee.Prof_pic_url);
      return (
        <div className="col-xs-6 col-sm-4" key={i}>
          <ProfImg 
            src={attendee.Prof_pic_url} title={attendee.First_name} />
        </div>);
    });
    if (attendees.length > 0)
      return (
        <div>
          <h4 className="text-center">Attendees</h4>
          <div className="row">
            {this.renderAttendeeRows(attNodes)}
          </div>
        </div>);
  },
  render: function() {
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by);
    var details;
    if (this.state.moreClicked) {
      details = 
        <div>
          <p><i className="fa fa-clock-o"></i>{" Rsvp by " + rsvpBy.format("h:mm a ddd, MMM Do")}</p>
          <p><i className="fa fa-user"></i>{" " + d.Capacity + " seats"}</p>        
          {this.renderAttendees()}
          <p><i className="fa fa-map-marker"></i> {" " + d.Address + ", " + d.City + ", " + d.State}</p>
        </div>
    }
    return(
      <div className="row">
        <p className="inline-block">{starts.format("h:mm a ddd, MMM Do")}</p>
        <button className="transparent-bg inline-block" onClick={this.handleMoreClicked}>
          <i className={(this.state.moreClicked)? "fa fa-chevron-up" :  "fa fa-chevron-down"}></i>
        </button>
        {details}
      </div>
    );
  }
});

var PopupsList = React.createClass({
  getInitialState: function(){
    var popups = this.props.data.Popups;
    return {popups: popups}
  },
  handleAddPopupSuccess: function(popup) {
    var popups = this.state.popups;
    popups.push(popup);
    this.setState({popups: popups});
  },
  render: function() {
    var d = this.props.data,
        popups = this.state.popups;
    if(popups.length > 0) {
      popupsNodes = d.Popups.map(function(popup, key) {
        return <PopupRow data={popup} key={key} />;
      });
      return (
        <div className="row">
          <div className="col-xs-9 col-xs-offset-3">
            <h5>Popups</h5>
            {popupsNodes}
            <AddPopupRow data={d} handleAddPopupSuccess={this.handleAddPopupSuccess}/>
          </div>
        </div>
      )
    }
  },
});

var MealListItem = React.createClass({
  getInitialState: function() {
      return {
        delete_error: "", 
        Published: this.props.data.Published,
        errors: []
      };
  },
  handleChange: function(obj) {
    this.setState(obj);
  },
  publishMeal: function() {
    // check if there are pictures
    // check if the time is proper
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by),
        errors = [];
    if (rsvpBy > starts) errors.push("Rsvp by time cannot be after meal starts.");
    if (rsvpBy < moment()) errors.push("Rsvp by time cannot be in the past.");
    if (starts < moment()) errors.push("Start time cannot be in the past.");
    if (d.Description.length < 1) errors.push("Add a description");
    if (d.Title.length < 1) errors.push("Add a title");
    if (d.Description.length < 1) errors.push("Please add a description");
    if (d.Pics.length < 1) errors.push("You must add pictures before you can publish your meal");
    this.setState({errors: errors});
    if (errors.length > 0) 
      return;
    var api_resp = api_call('meal',{
      method: "publishMeal", 
      mealId: this.props.data.Id, 
      session: Cookies.get("session")
    });
    if (api_resp.Success) {
      this.setState({Published: true});
    } else {
      this.setState({errors: [api_resp.Error]})
    }
    // api_call to publish meal
    // do some other shit
    // some other other other shit
  },
  deleteMeal: function() {
    var api_resp = api_call('meal', {
      method: 'deleteMeal', 
      session: Cookies.get('session'), 
      mealId: this.props.data.Id
    });
    if (!api_resp.Success){
      this.setState({delete_error: resp.Error});
      return;
    }
    this.props.handleMealDelete(this.props.key);
    $('#myModal' + this.props.key).modal('hide');
    // launch the modal
    // upon confirm, delete the meal
  },
  renderModal: function() {
    var d = this.props.data;
    var modalContent = 
      <div className="row text-center">
        <p>{"Are you sure you want to delete " + d.Title + "? This is forever-ever."}</p>
        <div className="row">
          <div className="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-2">
            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
          <p className="error-field">{this.state.delete_error}</p>
          <div className="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-2">
            <button type="button" className="btn-primary" onClick={this.deleteMeal}>Delete Meal</button>
          </div>
        </div>
      </div>;
    return (
        <Modal 
          id={"deleteMeal" + this.props.key}
          title="Delete Meal?"
          body={modalContent} />
      );
  },
  render: function() {
    var d = this.props.data;
    var pic_src = (d.Pics.length != 0)? 
      "https://yaychakula.com/img/" + d.Pics[0].Name :
      "https://yaychakula.com/img/camera.svg";  
    var edit_link = "/create_meal/" + d.Id,
        title_s = d.Title,
        title;
    var starts_s = moment(d.Starts).format("h:mm a dddd, MMMM Do YYYY");
    if (!title_s)
      title = <p>Untitled</p>;
    else if (moment(d.Starts) < moment()) // show the meal is past
      title = <p>{d.Title + " [PAST]"}</p>;
    else if (d.Published)
      title = <p><i className="fa fa-circle live"></i>{d.Title}</p>;
    else
      title = <p>{d.Title}</p>;
    var errors = this.state.errors.map(function(error, i) {
      return <li key={i}>{error}</li>
    });
    return (
      <div className="meal-list-item">
        <div className="row">
          <button className="btn-delete-meal text-center" 
            data-toggle="modal" 
            data-target={"#deleteMeal" + this.props.key}>
              <span className=" glyphicon glyphicon-trash delete-icon" aria-hidden="true"></span>
          </button>
          <div className="col-xs-3 text-center">
            <Link to={edit_link}>
              <img className="img-responsive meal-thumb" src={pic_src}/>
            </Link>
          </div>
          <div className="col-xs-8">
            <h4 className="meal-list-title">
              <Link to={edit_link}>
                {title}
              </Link>
            </h4>
            <div className="row">
              <p className="cost"><span className="glyphicon glyphicon-usd"></span>{" " + Math.round(d.Price*100)/100}</p>
              <p>{d.Description.substring(0, 100) + "..."}</p>
            </div>
          </div>
        </div>
        <ul className="error-field">
          {errors}
        </ul>
        {(d.Published)? 
          <PopupsList data={d} handleAddPopupSuccess={this.handleAddPopupSuccess}/> :
          <button className="c-blue-bg" onClick={this.publishMeal}>Publish</button>
        }
        <hr className="list-hr"/>
        {this.renderModal()}
      </div>
    );
  }
});

module.exports = React.createClass({
  componentWillMount: function() {
    if (!Cookies.get('session')) {
      window.location.replace("http://yaychakula.com");
    }
    var api_resp = api_call('host', {method:'getHost', session:Cookies.get('session')});
    var alert_create_host_profile;
    if (!api_resp.Success) { // forward to create host if they don't have a host identity
      return;
    }
    var host = api_resp.Return;
    if (!host.Stripe_connect) {
      this.setState({alert_create_host_profile: "Please complete your chef profile and connect to Stripe to host meals"});
      return;
    }
    this.getMeals();
  },
  getMeals: function() {
    var api_resp = api_call('meal', {
      method: 'getMealsForHost',
      session: Cookies.get('session')
    });
    if (!api_resp.Success) {
      return;
    }
    this.setState({meals: api_resp.Return});
  },
  handleMealDelete: function(index) {
      var meals = this.state.meals;
      meals.splice(index, 1);
      this.setState({meals: meals});
  },
  render: function() {
    var handleMealDelete = this.handleMealDelete;
    var listItems = [];
    if (this.state.meals)
      listItems = this.state.meals.map(function(meal, index){
        return <MealListItem 
          data={meal}
          title={meal.Title} 
          starts={meal.Starts}
          price={meal.Price}
          seats={meal.Capacity}
          id={meal.Id}
          pic={(meal.Pics.length != 0)? meal.Pics[0].Name : ''}
          key={index}
          published={meal.Published}
          handleMealDelete={handleMealDelete} />;
    });
    var first_item = 
      (this.state.alert_create_host_profile)?
        <div className="row text-center">
          <p className="banner warning-yellow-bg">{this.state.alert_create_host_profile}</p>
        <Link to="edit_host_info">
          <button className="c-blue-bg">Complete Chef Profile</button>
        </Link> 
        </div> :
        <Link to="create_meal/">
          <img className="img-responsive img-responsive-center add-meal-icon" src="/img/add-icon.svg"/>
        </Link>
    return (
      <div className="row non-white" id="create-meal">
        <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 meal-list">
          <h2>My Meals</h2>
          <div className="text-center">
            {first_item}
          </div>
          {listItems}
        </div>
      </div>);
  }
});