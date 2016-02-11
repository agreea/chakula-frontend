var React = require('react'),
    Link = require('react-router').Link,
    Checkout = require('../checkout.js'),
    Sticky = require('react-sticky'),
    Modal = require('../modal.js'),
    MealCard = require('../meal_card.js'),
    EmailSignup = require('../email_signup.js'),
    ProfImg = require('../prof_img.js'),
    Review = require('../review.js');
var Carousel = React.createClass({
  componentDidMount: function() { // dynamically center each image in the carousel frame
    $(".carousel img").each(function(){
        if ($(this).height() > $(this).parent().height()){
            var top_dif= ($(this).height()-$(this).parent().height())/2;
            $(this).css("top",-top_dif);
        }
        if ($(this).width() > $(this).parent().width()){
            var left_dif= ($(this).width()-$(this).parent().width())/2;
            $(this).css("left",-left_dif);
        }
    });
  },
  render: function() {
    var data = this.props.data;
    var pictures = data.Pics.map(function(pic, index) {
      if (index == 0) {
        return (<div className="item active">
          <img src={"https://yaychakula.com/img/" + pic.Name}></img>
          <div className="carousel-caption">{pic.Caption}</div>
        </div>);
      }
      return (<div className="item">
        <img src={"https://yaychakula.com/img/" + pic.Name}></img>
        <div className="carousel-caption">{pic.Caption}</div>
      </div>);
    });
    return (
      <div className="col-xs-12 col-sm-9" id="carousel-container">
      <div id="carousel" className="carousel slide text-center" data-ride="carousel" data-interval="false">
        <div className="carousel-inner" id="carousel-pics" role="listbox">
          {pictures}
        </div>
        <a className="left carousel-control" href="#carousel" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
      <h2 className="meal-title">{data.Title}</h2>
      </div>
    );
  }
});

var ReviewBox = React.createClass({
  render: function() {
    return (
      (this.props.data.length > 0) ?
      <div className="reviewBox">
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
  render: function() {
    // check meal type
    // if takeout, only show host
    // else show attendees too
    var data = this.props.data;
    return (<div className="row host-attendees-col">
      <Link to={"/chef/" + data.Host_id}>
        <div className="col-xs-12 col-sm-3">
          <ProfImg src={data.Host_pic}/>
        </div>
        <div className="col-xs-12 col-sm-9">
          <h3>{"About " + data.Host_name}</h3>
          <p>{data.Host_bio}</p>
        </div>
      </Link>
    </div>);
  }
});

var BookMeal = React.createClass({
  renderOrderWithLogin: function() {
      return <Link to={"/login?fwd=meal/" + this.props.data.Id + "?book_meal=true"}>
          <button className="c-blue-bg book-btn">Book</button>
        </Link>;
  },
  renderOrderBtn: function() {
    var data = this.props.data;
    var meal_closes = moment(data.Rsvp_by);
    var req_btn_disabled = 
      (meal_closes < moment()) || data.Status == "ATTENDING" || 
      data.Status == "DECLINED" || data.Status == "PENDING" || data.Open_spots == 0;
    var req_btn_text;
    if (data.Open_spots == 0)
      req_btn_text = "Sold out"
    else if (meal_closes < moment())
      req_btn_text = 'Meal closed';
    else
      req_btn_text = "Book";

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
  renderAttendeeRows: function(attNodes) {
    var attendeeRows = [], // two dimensional array. Each row contains 3 pic items
        thisRow = []; // second dimension of the array. Once a row stores 3 pics, you add it to the pic rows
    for (var i in attNodes) {
      // add this row to pic rows if it's full
      if (thisRow.length === 3) {
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
      return (
        <div className="col-xs-6 col-sm-4" key={i}>
          <ProfImg 
            src={attendee.Prof_pic_url} />
          <p className="text-center">{attendee.First_name}</p>
        </div>
      )
    });
    if (attendees.length > 0)
      return (
        <div>
          <h4 className="text-center">Attendees</h4>
          <div className="row">
            {this.renderAttendeeRows(attNodes)}
          </div>
        </div>
      )
  },
  render: function() {
    var data = this.props.data;
    var viewOtherMealsStyle = {paddingTop: "8px"};
    var bookMeal = 
      <div>
        <div className="book-meal">
          <div className="price-row">
            <h2>{"$" + Math.round(data.Price*100)/100}</h2><p>/person</p></div>
            {this.renderBookingInfo()}
            {this.renderOrderBtn()}
            <div className="row" style={viewOtherMealsStyle}>
              <button className="border-btn" id="view-other-meals"><b>View Other Meals</b></button>
            </div>
          </div>
        {this.renderAttendees()}
      </div>
    if (document.documentElement.clientWidth > 768) {
      return(
        <Sticky className="col-xs-12 col-sm-3 book-sticky" stickyClass="col-sm-3 col-sm-offset-9 book-sticky">
          {bookMeal}
        </Sticky>
      );
    } else 
      return bookMeal;
  }
});

var MealInfo = React.createClass({
  render: function() {
    // todo: truncate descriptions
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
    var data = this.props.data;
    var map_row;
    if (data.Status != "ATTENDING")
        map_row = 
          <img className="img-responsive" src={data.Maps_url}/>;
    else {
      map_row = 
        <div className="row map-row">
          <a href={'https://www.google.com/maps/place/' + data.Address + ' Washington, DC'} target="_blank">
            <img className="map-img img-responsive" src={data.Maps_url} />
          </a>
        </div>;
    }
    var avg_stars = [];
    if (data.Host_reviews !== null && data.Host_reviews.length > 0) { // process avg rating
      var ratings = data.Host_reviews.map(function(review) {
        return review.Rating;
      })
      var sum_ratings = ratings.reduce(function(previous, current) {
        return previous + current;
      });
      console.log("Sum ratings: " + sum_ratings);
      var avg_rating = (sum_ratings/data.Host_reviews.length);
      console.log("Average rating: " + avg_rating);
      while(avg_rating > 0) { // show the average rating in filled stars
        if (avg_rating < 1) { // for any remainder, round up to the next half-star and exit the loop
          if (avg_rating > .7) {
            avg_stars.push(<i className="fa fa-star"></i>);
          } else if (avg_rating > .3) {
            avg_stars.push(<i className="fa fa-star-half-o"></i>);
          }
          break;
        }
        avg_stars.push(<i className="fa fa-star"></i>);
        avg_rating--;
      }
      while(avg_stars.length < 5) { // for the remaining stars until five, show empty stars.
        avg_stars.push(<i className="fa fa-star-o"></i>);
      }
    }
    // handle newlines in the meal description
    var descLines = data.Description.split(/[\n\r]/g);
    var description = descLines.map(function(desc_line, index) {
      return <p key={index}>{desc_line}</p>;
    });
    var displayAddress = data.City + ", " + data.State;
    if (data.Address)
      displayAddress = data.Address + ", " + displayAddress;
    return (
      <div className="col-xs-12 col-sm-8 col-sm-offset-1">
          <div className="row">
            <p className="star-rating">{avg_stars}</p>
          </div>
          <div className="row">
            {description}
          </div>
          <HostInfo data={this.props.data}/>
          <div className="row">
            <p><i className="fa fa-map-marker"></i>{" " + displayAddress}</p>
            {(data.Status === "ATTENDING")? "" : <p>Full address is revealed upon purchase</p>}
          </div>
          {map_row}
          <div className="row">
            <ReviewBox data={data.Host_reviews} />
          </div>
          <div className="row">
            <UpcomingMeals data={data} />
          </div>
      </div>
    );
  }
});
var UpcomingMeals = React.createClass({
  render: function() {
    var d = this.props.data;
    return(
      <div id="other-meals"
        className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-0">
        <h2>Other Meals</h2>
        {d.Upcoming_meals.map(function(meal, index) {
          if(meal.Id != d.Id)
            return <MealCard data={meal} key={index}/>
        }) }
      </div>);
  }
});
module.exports = React.createClass({
  componentWillMount: function(){
    var resp = 
      api_call("meal", {
        method: "getMeal",
        session: Cookies.get("session"),
        mealId: this.props.params.id});
    if (resp.Success)
      this.setState({data: resp.Return});
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
  getInitialState: function() {
    return({data: this.props.data});
  },
  render: function() {
    var data = this.state.data;
    var checkout = 
      <Checkout cards={(data.Cards)? data.Cards : []} mealId={data.Id} open_spots={data.Open_spots} />;
    var emailSignup = <EmailSignup />;
    return(
      <div className="row">
        <div className="row text-center">
          <Carousel data={data}></Carousel>
          <BookMeal data={data}></BookMeal>
        </div>
        <div className="row">
          <MealInfo data={data}></MealInfo>
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