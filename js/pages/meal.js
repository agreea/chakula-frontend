var React = require('react');
var Link = require('react-router').Link;
var Checkout = require('../checkout.js');
var Carousel = React.createClass({
  render: function() {
    var pictures = this.props.data.map(function(pic, index) {
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
      <div id="carousel-example-generic" className="carousel slide text-center" data-ride="carousel" data-interval="false">
        <div className="carousel-inner" id="carousel-pics" role="listbox">
          {pictures}
        </div>
        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
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

var Review = React.createClass({
  render: function() {
    var stars = [];
    for (var i = 0; i < this.props.rating; i++) {
      stars.push(<i className="fa fa-star"></i>);
    }
    return (
      <div className="review row">
        <div className="col-sm-2 text-center">
            <img className="img-circle guest-pic img-responsive" src={this.props.pic_url}/>
            <p className="reviewer-name">
              {this.props.first_name}
            </p>
        </div>
        <div className="col-sm-10 review-text">
          <p className="star-rating">
            {stars}
          </p>
          <p>{this.props.children}</p>
          <div className="row">
            <div className="col-sm-8 review-meal-title">
              <p><Link to={"https://yaychakula.com/meal/" + this.props.meal_id}>
                {this.props.title}
              </Link></p>
            </div>
            <div className="col-sm-4">
              <p>
                {this.props.date}
              </p>
            </div>
          </div>
          <hr className="hr-review"/>
        </div>
      </div>
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
        <Review first_name={review.First_name} 
                date={moment(review.Date).format("MMM Do YYYY")} 
                pic_url={review.Prof_pic_url}
                rating={review.Rating}
                title={review.Meal_title}
                meal_id={review.Meal_id}>
          {review.Comment}
        </Review>
      );
    });
    return (
      <div className="reviewList">
        {reviewNodes}
      </div>
    );
  }
});

var HostAttendeesInfo = React.createClass({
  render: function() {
    // check meal type
    // if takeout, only show host
    // else show attendees too
    var data = this.props.data;
    console.log("HostAttendeesInfo data: ");
    console.log(data);
    return (<div className="row host-attendees-col">
      <Link to={`chef/${data.Host_id}`}>
        <div className="col-xs-12 col-sm-3">
          <img className="img-responsive img-responsive-center img-circle" src={data.Host_pic}/>
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
      return
        <Link to={"login?fwd=meal/" + this.props.data.Id + "?book_meal=true"}>
          <button className="brand-btn btn">{req_btn_text}</button>
        </Link>;
  },
  renderOrderBtn: function() {
    var data = this.props.data;
    var meal_closes = moment(data.Rsvp_by);
    var req_btn_disabled = 
      (meal_closes < moment()) || data.Status == "ATTENDING" || 
      data.Status == "DECLINED" || data.Status == "PENDING" || data.Open_spots == 0;
    var req_btn_text;
    if (meal_closes < moment())
      req_btn_text = 'Meal closed';
    else if (data.Open_spots == 0)
      req_btn_text = "Sold out"
    else 
      req_btn_text = "Book";
    if(!Cookies.get('session') && !req_btn_disabled)
      return this.renderOrderWithLogin();
    return <button 
          className="brand-btn btn" 
          id="request-meal-btn" 
          disabled={req_btn_disabled} 
          data-toggle="modal" 
          data-target="#request-modal">{req_btn_text}</button>;
  },
  renderBookingInfo: function() { // returns the date and time left to book the meal
    var meal_closes = moment(this.props.data.Rsvp_by),
        starts = moment(this.props.data.Starts);
    var booking_info = 
      [<p><i className="fa fa-clock-o"></i>{" " + starts.format("h:mm a ddd, MMM Do")}</p>]; 
    var booking_subinfo = 
      (meal_closes > moment() && this.props.data.Open_spots > 0)? 
        <p>{"Meal closes " + moment().to(meal_closes)}</p> :
        <p><span className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span> Event is closed</p>
    booking_info.push(booking_subinfo);
    return booking_info;
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
        <div className="col-xs-6 col-sm-4" k={i}>
          <img className="img-circle img-responsive img-responsive-center" 
            src={attendee.Prof_pic_url || "/img/user-icon.svg"} />
          <p>{attendee.First_name}</p>
        </div>
      )
    });
    if (attendees.length > 0)
      return (
        <div>
          <h4>Attendees</h4>
          <div className="row">
            {this.renderAttendeeRows(attNodes)}
          </div>
        </div>
      )
  },
  render: function() {
    var data = this.props.data;
    return(
      <div className="col-xs-12 col-sm-3">
        <div className="book-meal">
          <div className="price-row"><h2>{"$" + Math.round(data.Price*100)/100}</h2><p>/person</p></div>
          {this.renderOrderBtn()}
          {this.renderBookingInfo()}
        </div>
        {this.renderAttendees()}
      </div>
    );
  }
});

var MealInfo = React.createClass({
  render: function() {
    // todo: truncate descriptions
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
    // $('#time-left-subtext').text('Requests are now closed.');
    // $('#time-left-subtext').css("color", "#aaa"); // set text to grey
    var data = this.props.data;
    var map_row;
    if (data.Status != "ATTENDING")
        map_row = 
          <img src={data.Maps_url}/>;
    else {
      map_row = 
        <div className="row map-row">
          <a href={'https://www.google.com/maps/place/' + data.Address + ' Washington, DC'} target="_blank">
            <img className="map-img" src={data.Maps_url} />
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
    var description = descLines.map(function(desc_line) {
      return <p>{desc_line}</p>;
    });
    var displayAddress = `${data.City}, ${data.State}`;
    if (data.Address)
      displayAddress = `${data.Address}, ${displayAddress}`;
    return (
      <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-0">
          <div className="row">
            <h2>{data.Title}</h2>
            <p className="star-rating">{avg_stars}</p>
          </div>
          <div className="row">
            {description}
          </div>
          <HostAttendeesInfo data={this.props.data}/>
          <div className="row">
            <p><i className="fa fa-map-marker"></i>{" " + displayAddress}</p>
            {(data.Status === "ATTENDING")? "" : <p>Full address is revealed upon purchase</p>}
          </div>
          {map_row}
          <div className="row">
            <ReviewBox data={data.Host_reviews} />
          </div>
      </div>
    );
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
    if(this.props.location.query.book_meal)
      $('#request-modal').modal('show');
  },
  getInitialState: function() {
    return({data: this.props.data});
  },
  render: function() {
    var data = this.state.data;
    return(
      <div className="row">
        <div className="row text-center">
          <div className="col-xs-12 col-sm-9 col-sm-offset-2">
            <Carousel data={data.Pics}></Carousel>
          </div>
        </div>
        <div className="row">
          <BookMeal data={data}></BookMeal>
          <MealInfo data={data}></MealInfo>
        </div>
      <div id="request-modal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" id="request-meal-btn">&times;</button>
              <h4 className="modal-title text-center">Request Meal</h4>
            </div>
            <div className="modal-body row" id="modal-body">
              <div className="row">
                <Checkout cards={(data.Cards)? data.Cards : []} mealId={data.Id} open_spots={data.Open_spots} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
});