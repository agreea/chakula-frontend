var React = require('react');
var Link = require('react-router').Link,
    Modal = require('../modal.js'),
    ProfImg = require('../prof_img.js'),
    AddPopupRow = require('../add_popup.js');
var PopupRow = React.createClass({
  getInitialState: function() {
    return {moreClicked: false};
  },
  componentDidMount: function() {
    $('[data-toggle="tooltip"]').tooltip();
  },
  getSeatsSold: function() {
    var attendees = this.props.data.Attendees,
        seatsSold = 0;
    for (var i in attendees){
      seatsSold += attendees[i].Seats;
    }
    return seatsSold;
  },
  handleMoreClicked: function() {
    var moreClicked = this.state.moreClicked;
    this.setState({moreClicked: !moreClicked});
  },
  renderAttendees: function() {
    var attendees = this.props.data.Attendees;
    var attendeeNodes = attendees.map(function(attendee, i) {
      return (
        <div className="col-xs-4 col-sm-3 col-lg-2" key={i}>
          <ProfImg 
            src={attendee.Prof_pic_url} title={attendee.First_name} />
        </div>);
    });
    if (attendees.length > 0)
      return (
        <div>
          <h4 className="text-center">Attendees</h4>
          <div className="row">
            {attendeeNodes}
          </div>
        </div>);
  },
  renderSeatsBadge: function() {
    var d = this.props.data,
        seatsSold = this.getSeatsSold(),
        seatsBadgeText, 
        seatsBadge;
    if (seatsSold == d.Capacity)
      seatsBadgeText = "SOLD OUT!";
    else if (seatsSold == 1)
      seatsBadgeText = seatSold + " seat sold";
    else
      seatsBadgeText = seatsSold + " seats sold";
    var colorMod = (d.Capacity == seatsSold)? "hot-orange-bg" : "seapunk-bg";
    if (moment(d.Rsvp_by) < moment())
      colorMod = "inactive-gray-bg";
    if (seatsSold > 0)
      return(
        <p className={"badge " + colorMod}>
          {seatsBadgeText}
        </p>);
  },
  renderDetails: function(){
    if (!this.state.moreClicked)
      return;
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by);
    return(
      <div>
        <p><i className="fa fa-clock-o"></i>{" Rsvp by " + rsvpBy.format("h:mm a ddd, MMM Do")}</p>
        <p><i className="fa fa-user"></i>{" " + d.Capacity + " seats"}</p>        
        {this.renderAttendees()}
        <p><i className="fa fa-map-marker"></i> {" " + d.Address + ", " + d.City + ", " + d.State}</p>
      </div>);
  },
  render: function() {
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by);
    var liveDot = 
      (rsvpBy > moment())? 
            <i className="fa fa-circle live-dot active-green"
              data-toggle="tooltip" 
              data-placement="top" 
              title="Reservations are open"></i> :
            <i className="fa fa-circle live-dot inactive-gray"
              data-toggle="tooltip" 
              data-placement="top" 
              title="Reservations are closed"></i>;
    return(
      <div className="row">
        <p className="inline-block">
          {liveDot}
          {" " + starts.format("h:mm a ddd, MMM Do")}
        </p>
        {this.renderSeatsBadge()}
        <button className="transparent-bg inline-block" onClick={this.handleMoreClicked}>
          <i className={(this.state.moreClicked)? "fa fa-chevron-up" :  "fa fa-chevron-down"}></i>
        </button>
        {this.renderDetails()}
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
    $('#deleteMeal' + this.props.key).modal('hide');
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
        title = (!d.Title)? <p>Untitled</p> : <p>{d.Title}</p>,
        starts_s = moment(d.Starts).format("h:mm a dddd, MMMM Do YYYY"),
        errors = this.state.errors.map(function(error, i) {
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