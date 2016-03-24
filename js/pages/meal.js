var React = require('react'),
    Link = require('react-router').Link,
    Checkout = require('../checkout.js'),
    Sticky = require('react-sticky'),
    Modal = require('../modal.js'),
    MealCard = require('../meal_card.js'),
    EmailSignup = require('../email_signup.js'),
    ProfImg = require('../prof_img.js'),
    Review = require('../review.js');
function getOpenSpots(capacity, attendees) {
  var bookedSeats = 0;
  for(var i in attendees) {
    bookedSeats += attendees[i].Seats;
  }
  return capacity - bookedSeats;
}
var Carousel = React.createClass({
  componentDidMount: function() { 
  // dynamically center each image in the carousel frame
    $(".carousel img").each(function(){
        if ($(this).height() > $(this).parent().height()){
          console.log("adjusting for height");
            var top_dif= ($(this).height()-$(this).parent().height())/2;
            $(this).css("top",-top_dif);
        }
        if ($(this).width() > $(this).parent().width()){
            console.log("adjusting for height");
            var left_dif= ($(this).width()-$(this).parent().width())/2;
            $(this).css("left",-left_dif);
        }
    });
  },
  renderPics: function() {
    return this.props.data.Pics.map(function(pic, index) {
      if (index == 0) {
        return (<div className="item active" key={index}>
          <img src={"https://yaychakula.com/img/" + pic.Name}></img>
          <div className="carousel-caption">{pic.Caption}</div>
        </div>);
      }
      return (<div className="item" key={index}>
        <img src={"https://yaychakula.com/img/" + pic.Name}></img>
        <div className="carousel-caption">{pic.Caption}</div>
      </div>);
    });
  },
  render: function() {
    var data = this.props.data,
        pictures = this.renderPics();
    return (<div className="col-xs-12 col-sm-8 col-md-9" id="carousel-container">
      <div id="carousel" className="carousel slide text-center" data-ride="carousel" data-interval="false">
        <div className="carousel-inner" id="carousel-pics" role="listbox">
          {pictures}
        </div>
        <a className="left carousel-control" href="#carousel" role="button" data-slide="prev" 
          hidden={pictures.length < 2}>
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel" role="button" data-slide="next" 
          hidden={pictures.length < 2}>
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>);
  }
});

var ReviewBox = React.createClass({
  render: function() {
    return (
      (this.props.data.length > 0) ?
      <div className="row reviewBox">
        <h3 className="text-left">Reviews</h3>
        <ReviewList data={this.props.data} />
      </div> : <p></p>
    );
  }
});

var ReviewList = React.createClass({
  render: function() {
    if (!this.props.data){
      return (
        <div className="reviewList">
          <p>No reviews yet!</p>
        </div>
      );
    }
    var reviewNodes = this.props.data.map(function (review) {
      return (
        <Review data={review}/>
      );
    });
    return (
      <div className="reviewList">
        {reviewNodes}
      </div>
    );
  }
});

var HostInfo = React.createClass({
  getInitialState: function() {
    return {followsHost: this.props.data.Follows_host};
  },
  handleFollowClicked: function() {
    // if followed, show unfollow modal
    // if not followed, tell the api to follow host
  },
  render: function() {
    // check meal type
    // if takeout, only show host
    // else show attendees too
    var data = this.props.data;
    var followsBadge = (data.Follows_host)? 
      <span className="badge inline-block seapunk-bg">Following</span> :
      <span className="badge inline-block c-blue-bg" onClick={this.handleFollowClicked}>Follow Chef</span>;
    return (<div className="row host-attendees-col">
      <Link to={"/chef/" + data.Host_id}>
        <div className="col-xs-12 col-sm-3 col-md-2">
          <ProfImg src={data.Host_pic}/>
        </div>
      </Link>

        <div className="col-xs-12 col-sm-9">
          <div>
            <Link to={"/chef/" + data.Host_id}>
              <h3 className="chef-header inline-block">{"About " + data.Host_name}</h3>
            </Link>
            {followsBadge}
          </div>
          <p>{data.Host_bio}</p>
        </div>
    </div>);
  }
});

var BookMeal = React.createClass({
  getInitialState: function() {
    var selectedPopup = 
      (this.props.data.Popups.length > 0)? this.props.data.Popups[0].Id : -1;
    return({
      selectedPopup: selectedPopup,
      topOffset: 0
    });
  },
  handlePopupSelected: function(e) {
    this.setState({selectedPopup: e.target.id});
    this.props.handlePopupSelectedParent(e.target.id);
  },
  handleStickyStateChange: function() {
    var topOffset = $(".publish").height() || 0;
    this.setState({topOffset: topOffset});
  },
  renderOrderWithLogin: function() {
      return <Link to={"/login?fwd=meal/" + this.props.data.Id + "?book_meal=true"}>
          <button className="c-blue-bg book-btn">Book</button>
        </Link>;
  },
  renderOrderBtn: function() {
    var popup = this.getSelectedPopup();
    if (!popup){
      return <button 
          className="c-blue-bg book-btn" 
          id="request-meal-btn" 
          disabled="true" 
          data-toggle="modal" 
          data-target="#request-modal">Meal is Closed</button>;
    }
    var data = this.props.data,
        meal_closes = moment(popup.Starts),
        openSpots = getOpenSpots(popup.Capacity, popup.Attendees);

    var req_btn_disabled = 
      (meal_closes < moment()) || popup.Attending || openSpots == 0;
    var req_btn_text;
    if (openSpots == 0)
      req_btn_text = "Sold out"
    else if (meal_closes < moment())
      req_btn_text = 'Meal closed';
    else if (popup.Attending)
      req_btn_text = "Attending"
    else
      req_btn_text = "Book";
    // TODO: show booked even if you render order w login
    if(!Cookies.get('session') && !req_btn_disabled) {
      return this.renderOrderWithLogin();
    }
    return <button 
          className="c-blue-bg book-btn" 
          id="request-meal-btn" 
          disabled={req_btn_disabled} 
          data-toggle="modal" 
          data-target="#request-modal">{req_btn_text}</button>;
  },
  renderMealClosesInfo: function() {
    var d = this.props.data;
    var meal_closes = moment(d.Rsvp_by);
    // if there are < 5 days left and open spots, show alert
    // else show view other meals
    // alert user if meal closes in the next 5 days and there's open spots
    if (meal_closes.isBetween(moment(), moment().add(5, "days")) && d.Open_spots > 0)
      return <p>{"Meal closes " + moment().to(meal_closes)}</p>
    // else link them to the other meals section
  },
  renderBookingInfo: function() { // returns the date and time left to book the meal
    var meal_closes = moment(this.props.data.Rsvp_by),
        starts = moment(this.props.data.Starts);
    return(
      <div>
      <p><i className="fa fa-clock-o"></i>{" " + starts.format("h:mm a ddd, MMM Do")}</p>
      {this.renderMealClosesInfo()}
      </div>); 
  },
  renderAttendees: function() {
    var selectedPopup = this.getSelectedPopup();
    if (!selectedPopup)
      return;
    var attendees = this.getSelectedPopup().Attendees,
        maxPerRow = { xs: 3 };
    var attendeeNodes = attendees.map(function(attendee, i) {
      var attendeeName = attendee.First_name;
      if (attendee.Seats > 1)
        attendeeName += " " + attendee.Seats;
      return (
        <div className="col-xs-6 col-sm-4" key={i}>
          <ProfImg src={attendee.Prof_pic_url} />
          <p className="text-center">{attendeeName}</p>
        </div>);
    });
    if (attendees.length > 0)
      return (
        <div>
          <h4 className="text-center">Attendees</h4>
          {attendeeNodes}
        </div>);
  },
  getSelectedPopup: function() {
    var selectedPopupId = this.state.selectedPopup;
    if (selectedPopupId == -1) 
      return;
    return this.props.data.Popups.reduce(function(previous, current){
      if(previous.Id == selectedPopupId)
        return previous;
      if(current.Id == selectedPopupId)
        return current;
    });
  },
  renderPopupsList: function() {
    var handlePopupSelected = this.handlePopupSelected;
    return this.props.data.Popups.map(function(popup){
      var openSpots = getOpenSpots(popup.Capacity, popup.Attendees);
      return(
        <li key={popup.Id}>
          <button className="white-bg" id={popup.Id} onClick={handlePopupSelected}>
            <p id={popup.Id}>{moment(popup.Starts).format("dddd, MMMM Do, h:mma")}</p>
            <p id={popup.Id}>{popup.City + ", " + popup.State}</p>
            <hr id={popup.Id}/>
          </button>
        </li>);
    });
  },
  renderPopups: function() {
    var selectedPopup = this.getSelectedPopup();
    if (!selectedPopup)
      return;
    return(
      <div className="dropdown">
        <button className="border-btn white-bg" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {moment(selectedPopup.Starts).format("dddd, MMMM Do, @h:mma")}
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          {this.renderPopupsList()}
        </ul>
      </div>
    )
  },
  renderPopupInfo: function(){
    var selectedPopup = this.getSelectedPopup();
    if (!selectedPopup)
      return;
    var openSpots = getOpenSpots(selectedPopup.Capacity, selectedPopup.Attendees);
    if (openSpots < 5) {
      if (openSpots == 1)
        return <p>{"Only one seat left"}</p>;
      else 
        return <p>{"Only " + openSpots + " seats left"}</p>;
    } else if (this.props.data.New_host)
      return <h3><strong>{"New chef discount!"}</strong></h3>;
  },
  renderBookMeal: function() {
    var data = this.props.data;
    var viewOtherMealsStyle = {paddingTop: "8px"};
    return(
      <div>
        <div className="book-meal">
          <div className="price-row">
            <h2>{"$" + Math.round(data.Price*100)/100}</h2><p>/person</p></div>
            {this.renderPopups()}
            {this.renderPopupInfo()}
            {this.renderOrderBtn()}
            <div className="row" style={viewOtherMealsStyle}>
              <button className="border-btn" id="view-other-meals"><b>View Other Meals</b></button>
            </div>
          </div>
        {this.renderAttendees()}
      </div>);
  },
  render: function() {
    if (document.documentElement.clientWidth > 768) {
      var stickyStyle = {
        position: "fixed",
        top: this.state.topOffset,
        left: 0,
        right: 0};
      return(
        <Sticky className="col-xs-12 col-sm-4 col-md-3 book-sticky" 
                stickyClass="col-sm-4 col-sm-offset-8 col-md-3 col-md-offset-9 book-sticky"
                stickyStyle={stickyStyle}
                onStickyStateChange={this.handleStickyStateChange}>
          {this.renderBookMeal()}
        </Sticky>
      );
    } else 
      return this.renderBookMeal();
  }
});

var MealInfo = React.createClass({
  renderMapWithAddress: function() {
    var popup = this.props.popup;
    return( 
      <div className="row map-row">
        <p><i className="fa fa-map-marker"></i>{" " + popup.Address + ", " + popup.City + ", " + popup.State}</p>
        <a href={'https://www.google.com/maps/place/' + popup.Address + ', ' + popup.City + ' ,' + popup.State} 
          target="_blank">
          <img className="map-img img-responsive" src={popup.Maps_url} />
        </a>
      </div>);
  },
  renderMapNoAddress: function() {
    var popup = this.props.popup;
    return(
      <div className="row">
        <p><i className="fa fa-map-marker"></i>{" " + popup.City + ", " + popup.State}</p>
        <p>Full address is revealed upon purchase</p>
        <img className="img-responsive" src={popup.Maps_url}/>
      </div>);
  },
  renderMapsRow: function() {
    var popup = this.props.popup;
    if (!popup || popup == -1)
      return;
    return (popup.Attending)? this.renderMapWithAddress() : this.renderMapNoAddress();
  },
  renderDescription: function() {
    // meal paragraphs in the description
    var descLines = this.props.data.Description.split(/[\n\r]/g);
    var description = descLines.map(function(desc_line, index) {
      return <p key={index}>{desc_line}</p>;
    });
    return <div className="row">{description}</div>;
  },
  renderAvgStars: function() {
    var data = this.props.data,
        avg_stars = [];
    if (data.Host_reviews !== null && data.Host_reviews.length > 0) { // process avg rating
      var ratings = data.Host_reviews.map(function(review) {
        return review.Rating;
      })
      var sum_ratings = ratings.reduce(function(previous, current) {
        return previous + current;
      });
      var avg_rating = (sum_ratings/data.Host_reviews.length);
      while(avg_rating > 0) { // show the average rating in filled stars
        if (avg_rating > .3 && avg_rating < .7) {
            avg_stars.push(<i className="fa fa-star-half-o" id={5 - avg_rating}></i>);
            break;
        }
        avg_stars.push(<i className="fa fa-star" id={5 - avg_rating}></i>);
        avg_rating--;
      }
      while(avg_stars.length < 5) { // for the remaining stars until five, show empty stars.
        avg_stars.push(<i className="fa fa-star-o"></i>);
      }
    }
    return <p className="star-rating">{avg_stars}</p>;
  },
  render: function() {
    // todo: truncate descriptions
    var data = this.props.data;
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-1">
          <h2 className="meal-title">{data.Title}</h2>
          {this.renderAvgStars()}
          {this.renderDescription()}
          <HostInfo data={data}/>
          {this.renderMapsRow()}
          <ReviewBox data={data.Host_reviews} />
          <UpcomingMeals data={data} />
      </div>
    );
  }
});
var UpcomingMeals = React.createClass({
  render: function() {
    var d = this.props.data;
    var upcomingMealCards = 
      d.Upcoming_meals.map(function(meal, index) {
        if(meal.Id != d.Id)
          return <MealCard data={meal} key={index}/>
      });
    return(
      <div className="row">
        <div id="other-meals"
          className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-0">
          <h2>Other Meals</h2>
          {upcomingMealCards}
        </div>
      </div>);
  }
});

module.exports = React.createClass({
  handlePopupSelected: function(id) {
    this.setState({selectedPopup: id});
  },
  getSelectedPopup: function() {
    var selectedPopupId = this.state.selectedPopup;
    if (this.state.selectedPopup === -1) {
      return;
    }
    return this.state.data.Popups.reduce(function(previous, current){
      if(previous.Id == selectedPopupId)
        return previous;
      if(current.Id == selectedPopupId)
        return current;
    }) || -1;
  },
  componentWillMount: function(){
    var resp = 
      api_call("meal", {
        method: "getMeal",
        session: Cookies.get("session"),
        mealId: this.props.params.id});
    if (resp.Success) {
      var data = resp.Return;
      var selectedPopup = (data.Popups.length > 0)? data.Popups[0].Id : -1;
      this.setState({data: data, selectedPopup: selectedPopup});
    }
  },
  componentDidMount: function() {
    var q = this.props.location.query;
    if (q.book_meal)
      $('#request-modal').modal('show');
    if (q.modal && !Cookies.get('session') && !Cookies.get('email'))
      $('#email-modal').modal('show');
    $("#view-other-meals").click(function() {
      $('html,body').animate({scrollTop: $("#other-meals").offset().top},'medium');
    });
  },
  publishMeal: function() {
    // do the usual check
    // if anything is wrong, pop open a modal with a link to edit the meal at the bottom
  },
  getInitialState: function() {
    return({data: this.props.data, selectedPopup: 0});
  },
  renderPublishAlert: function() {
    if (this.state.data.Published)
      return
    var stickyStyle = { 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2
    };
    return (
      <Sticky className="publish row warning-yellow-bg" stickyStyle={stickyStyle}>
        <div className="col-xs-8 col-sm-6 col-sm-offset-2">
          <p><strong>This meal is not published and cannot be viewed by others.</strong></p>
        </div>
        <div className="col-xs-4 col-sm-4 text-right">
          <Link to={"create_meal/" + this.state.data.Id}>
            <button className="inline-block c-blue white-bg">Edit</button>
          </Link>
          <button className="inline-block c-blue-bg" onClick={this.publishMeal}>Publish</button>
        </div>
      </Sticky>
    );
    // if your meal is not published, show an alert
  },
  render: function() {
    var data = this.state.data;
    // checkout needs popup_id
    var selectedPopup = this.getSelectedPopup();
    var checkout = (selectedPopup)?
      <Checkout cards={(data.Cards)? data.Cards : []} popup={selectedPopup} price={data.Price} /> : "";
    var emailSignup = <EmailSignup />;
    return(
      <div className="row">
        {this.renderPublishAlert()}
        <div className="row text-center">
          <Carousel data={data}></Carousel>
          <BookMeal data={data} handlePopupSelectedParent={this.handlePopupSelected}></BookMeal>
        </div>
        <div className="row">
          <MealInfo data={data} popup={selectedPopup}></MealInfo>
        </div>
        <Modal id="request-modal"
          title="Book Meal"
          body={checkout} />
        <Modal id="email-modal"
          title="Get Weekly Invites to Chakula Popups"
          body={emailSignup} />
      </div>);
  }
});