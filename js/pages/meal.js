var React = require('react');
var Carousel = React.createClass({
  render: function() {
    var pictures = this.props.data.map(function(pic, index) {
      if (index == 0) {
        return (<div className="item active">
          <img src={"img/" + pic.Name}></img>
          <div className="carousel-caption">{pic.Caption}</div>
        </div>);
      }
      return (<div className="item">
        <img src={"img/" + pic.Name}></img>
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
      <div className="reviewBox">
        <h3 className="text-left">Reviews</h3>
        <ReviewList data={this.props.data} />
      </div>
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
              <p><a href={"https://yaychakula.com/meal.html?Id=" + this.props.meal_id}>
                {this.props.title}
              </a></p>
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
      <div className="col-xs-12 col-sm-3">
        <img className="img-responsive img-responsive-center img-circle" src={data.Host_pic}/>
      </div>
      <div className="col-xs-12 col-sm-9">
        <h3>{"About " + data.Host_name}</h3>
        <p>{data.Host_bio}</p>
      </div>
    </div>);
  }
});

var BookMeal = React.createClass({
  render: function() {
    var data = this.props.data;
    var req_btn_disabled = 
      (moment(data.Rsvp_by) < moment()) || 
      data.Status == "ATTENDING" || 
      data.Status == "DECLINED" || 
      data.Status == "PENDING";
    var starts = moment(data.Starts);
    var req_btn_text;
    if (moment(meal_data.Rsvp_by < moment())) {
      req_btn_text = 'Meal closed';
    } else {
      req_btn_text = "Book";
    }
    var order_btn = 
      <button className="brand-btn btn" id="request-meal-btn" 
        disabled={req_btn_disabled}>{req_btn_text}</button>;
    var time_left_text;
    var booking_info = 
      [<p><i className="fa fa-clock-o"></i>{" " + starts.format("h:mm a ddd, MMM Do")}</p>,
        <p><span className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span> Event is closed</p>];
    if (moment(data.Rsvp_by) > moment()) {
      booking_info.push(<p>{closes.toNow() + " left to book"}</p>);
    }
    return(
      <div className="col-xs-12 col-sm-3">
        <div className="book-meal">
          <div className="price-row"><h2>{"$" + Math.round(this.props.data.Price*100)/100}</h2><p>/person</p></div>
          {order_btn}
          {booking_info}
        </div>
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
    var closes = moment(data.Rsvp_by);
    var map_row;
    if (data.Status != "ATTENDING") {
        map_row = 
          <div className="row map-row" style={{backgroundImage: 'url("' + data.Maps_url + '")'}}>
            <svg className="map-radius" height="100" width="100">
              <circle cx="50" cy="50" r="40" stroke="#3C8BA6" stroke-width="2" fill="#6DCDED" opacity=".8" />
            </svg>   
          </div>;
    } else {
      map_row = 
        <div className="row map-row">
          <a href={'https://www.google.com/maps/place/' + data.Address + ' Washington, DC'} target="_blank">
            <img className="map-img" src={data.Maps_url} />
          </a>
        </div>;
    }
    var avg_stars = [];
    if (data.Host_reviews !== null) { // process avg rating
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
    var desc_lines = data.Description.split(/[\n\r]/g);
    var description = desc_lines.map(function(desc_line) {
      return <p>{desc_line}</p>;
    });

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
            <p><i className="fa fa-map-marker"></i>{" " + data.Address}</p>
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
  componentDidMount: function() {
    var api_resp = api_call("meal", {
                      method: "getMeal",
                      session: Cookies.get("session"),
                      mealId: this.props.params.id,
                    });
    if (api_resp.Success) {
      this.props.data = api_resp.Return;
      console.log(api_resp.Return);
    } else {
      window.location.replace("https://yaychakula.com");
    }
  },
  render: function() {
    return(
      <div className="row">
        <div className="row text-center">
          <div className="col-xs-12 col-sm-9 col-sm-offset-2">
            <Carousel data={this.props.data.Pics}></Carousel>
          </div>
        </div>
        <div className="row">
          <BookMeal data={this.props.data}></BookMeal>
          <MealInfo data={this.props.data}></MealInfo>
        </div>
    </div>);
  }
});