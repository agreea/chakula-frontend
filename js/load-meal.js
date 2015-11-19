var api_resp = getMeal();
var meal_data;
if (api_resp.Success) {
  meal_data = api_resp.Return;
} else {
  window.location.replace("https://yaychakula.com");
}

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
        <h3 className="text-center">Reviews</h3>
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
          {this.props.children}
          <div className="row">
            <div className="col-sm-8 review-meal-title">
              <a href={"https://yaychakula.com/meal.html?Id=" + this.props.meal_id}>
                {this.props.title}
              </a>
            </div>
            <div className="col-sm-4">
              <p>
                {this.props.date}
              </p>
            </div>
          </div>
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

// 
var MealInfo = React.createClass({
  render: function() {
    // todo: truncate descriptions
    moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
      $('#time-left-subtext').text('Requests are now closed.')
      $('#time-left-subtext').css("color", "#aaa") // set text to grey
    var data = this.props.data;
    var starts = moment(data.Starts);
    var closes = moment(data.Rsvp_by);
    var time_left_text;
    var time_left_subtext;
    if (moment(data.Rsvp_by) < moment()) {
      time_left_text = <span className="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>;
      time_left_subtext = "Requests are closed";
    } else {
      time_left_text = closes.toNow();
      time_left_subtext = "Requests close"
    }
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
    return (
      <div className="col-sm-7">
        <div className="row">
          <h3>{data.Title}</h3>
        </div>
        <div className="row">
          <div className="col-xs-4">
            <h4 className="text-center">{data.Open_spots}</h4>
            <p className="text-center">spots open</p>
          </div>
          <div className="col-xs-4">
            <h4 className="text-center">{starts.format("h:mm a")}</h4>
            <p className="text-center">{starts.format("ddd, MMM Do")}</p>
          </div>
          <div className="col-xs-4">
            <h4 className="text-center">{time_left_text}</h4>
            <p className="text-center">{time_left_subtext}</p>
          </div>
        </div>
        <div className="row">
          <p>{data.Description}</p>
        </div>
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


var HostAttendeesInfo = React.createClass({
  render: function() {
    // check meal type
    // if takeout, only show host
    // else show attendees too
    var data = this.props.data;
    console.log("HostAttendeesInfo data: ");
    console.log(data);
    var sum_ratings = data.Host_reviews.reduce(function(previous, current) {
      console.log("Reduce current rating: ");
      console.log(current.Rating);
      return previous.Rating + current.Rating;
    });
    console.log("Sum ratings: " + sum_ratings);
    var avg_rating = (sum_ratings/data.Host_reviews.length);
    console.log("Average rating: " + avg_rating);
    var avg_stars = [];
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
    return (<div className="col-sm-3 col-xs-12 host-attendees-col">
      <img className="img-responsive img-responsive-center img-circle" src={data.Host_pic}/>
      <p className="text-center">{data.Host_name}</p>
      <p className="text-center">{avg_stars}</p>
    </div>);
  }
});

var Meal = React.createClass({
  render: function() {
    var req_btn_disabled = (moment(meal_data.Rsvp_by < moment()) || this.props.data.Status == "ATTENDING" || this.props.data.Status == "DECLINED" || this.props.data.Status == "PENDING");
    var req_btn_text;
    if (moment(meal_data.Rsvp_by < moment())) {
      req_btn_text = 'Meal closed';
    } else {
      req_btn_text = "Order - $" + Math.round(this.props.data.Price*100)/100;
    }
    return(
      <div className="row">
        <div className="row">
          <Carousel data={this.props.data.Pics}></Carousel>
        </div>
        <div className="row">
          <HostAttendeesInfo data={this.props.data}/>
          <MealInfo data={this.props.data}/>
          <div className="col-xs-2">
            <button className="brand-btn btn" id="request-meal-btn" disabled={req_btn_disabled}>{req_btn_text}</button>
          </div>
        </div>
    </div>);
  }
});

React.render(
  <Meal data={meal_data}/>,
  document.getElementById('meal')
);

// function setupMeal() {
//     $('#meal-title').text(meal_data.Title);
//     $('#meal-description').text(meal_data.Description);
//     $('#host-name').text(meal_data.Host_name);
//     $('#host-pic').attr("src", meal_data.Host_pic);
//     $('#open-spots').text(meal_data.Open_spots);
//     if (meal_data.Open_spots === 1) {
//       $('#open-spots-subtext').text('seat available')
//     }
//     $('#host-bio').text(meal_data.Host_bio);
//     // attendees = meal_data.Attendees;
//     // for (i in attendees) {
//     //   console.log(attendees[i])
//     //   $('#attendees').append('<div class="col-xs-6 col-sm-4 col-md-3"> <img class="img-responsive img-circle" src="'+ 
//     //     attendees[i].Prof_pic_url + '"><p>' + attendees[i].First_name + '</p></div>')
//     // }
//     // if (attendees.length === 0) {
//     //   $('#attendees').append('<div class="col-xs-6 col-sm-4 col-md-3"><p>' 
//     //     + 'Be the first!'+ '</p></div>');
//     // }
//     pics = meal_data.Pics;
//     console.log(pics);
//     console.log(pics[0]);
//     setupCarousel(pics);
//     request_button = $('#request-meal-btn');
//     // Set the button text, text color, and background color according to meal status
//     if (meal_data.Status != "NONE") {
//       request_button.text(meal_data.Status);
//       request_button.prop('disabled', true);
//     } else {
//       request_button.text("Request Meal - $" + Math.round(meal_data.Price*100)/100);
//       $('#meal-address').css('color', '#8c8c8c');
//     }
//     if (meal_data.Status === "PENDING") {
//       request_button.css("background-color", "#8cd3e8");
//       request_button.css("color", "#2e464c");
//     } else if (meal_data.Status === "ATTENDING") {
//       request_button.html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Attending");
//       request_button.css("background-color", "#19a347");
//       request_button.css("color", "#fff");
//     } else if (meal_data.Status === "DECLINED") {
//       request_button.css("background-color", "#71ccdb");
//       request_button.css("color", "#233f44");
//     } else if (meal_data.Open_spots === 0) {
//       request_button.prop('disabled', true);
//       request_button.text("Sold out!");
//     }
//     $('#meal-address').html('<p><b><i class="fa fa-map-marker"></i> '+ meal_data.Address + '</b></p>');
//     start = Date.parse(meal_data.Starts);
//     console.log("Start date: " + start);
//     console.log("RSVP by: " + meal_data.Rsvp_by);
//     rsvp_by = Date.parse(meal_data.Rsvp_by);
//     processDates(start, rsvp_by);
// }

function getMeal(){
  urlVars = getUrlVars();
  api_resp = api_call("meal", {
                      method: "getMeal",
                      session: Cookies.get("session"),
                      mealId: urlVars["Id"],
                    });
  console.log(api_resp);
  return api_resp;
}

// Takes dates as iso8601 formatted string, assigns start time as 8:30 PM Sun, October 15
// assigns rsvp_by in days, hours, or minutes left
// function processDates(start_time, rsvp_by) {
//   // start time:
//   // get the time in hours & minutes. Set that to the main #
//   // get the time in days, month, and time. Set that to the subtext
//   date = new Date(start_time);
//   month = getShortMonth(date.getMonth()+1);
//   console.log("Month: " + date.getMonth());
//   console.log("Date: " + date.getDate());
//   console.log("Day: " + date.getDay());
//   date_day = date.getDate();
//   week_day = getDayOfWeek(date.getDay());
//   time_text = getHumanTime(date.getHours(), date.getMinutes());
//   time_subtext = "on " + week_day + ", " + month + " " + date_day;
//   $('#meal-time').text(time_text);
//   $('#meal-time-subtext').text(time_subtext);
//   // RSVP time:
//   // get the current time, run a diff
//   second = 1000;
//   minute = second * 60;
//   hour = minute * 60;
//   day = hour * 24;
//   time_left = rsvp_by - Date.now()
//   if (time_left > day) {
//     $('#time-left').text(Math.round(time_left/day));
//     $('#time-left-subtext').text('days til requests close.');
//   } else if (time_left > hour) {
//     $('#time-left').text(Math.round(time_left/hour));
//     $('#time-left-subtext').text('hours til requests close.');
//     $('#time-left-subtext').css("color", "##FFCC00") // set text to yellow
//   } else if (time_left > minute) {
//     $('#time-left').text(Math.round(time_left/hour));
//     $('#time-left-subtext').text('minutes til requests close.');
//     $('#time-left-subtext').css("color", "#ff0000"); // set text to red
//   } else if (time_left < 0) {
//     $('#time-left').html('<span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>'); 
//     $('#time-left').css("color", "#aaa") // set text to grey
//     $('#time-left-subtext').text('Requests are now closed.')
//     $('#time-left-subtext').css("color", "#aaa") // set text to grey
//     request_button = $('#request-meal-btn').prop('disabled', true);
//     request_button.text('Meal closed');

//   }
//   // if rsvp_by - now > 24 hours ==> "# days left"
//   // else if rsvp_by - now > 1 hour ==> "# hours left" (text is yellow)
//   // else if rsvp_by - now > 1 minute ==> "# minutes left" (text is red)
//   // else ==> "Closed" (text is grey)
// }

// function getShortMonth(month) {
//   switch (month) {
//     case 1:
//       return "Jan";
//     case 2:
//       return "Feb";
//     case 3: 
//       return "Mar";
//     case 4:
//       return "Apr";
//     case 5:
//       return "May";
//     case 6:
//       return "Jun";
//     case 7:
//       return "Jul";
//     case 8:
//       return "Aug";
//     case 9:
//       return "Sep";
//     case 10:
//       return "Oct";
//     case 11:
//       return "Nov";
//     case 12:
//       return "Dec";
//     default:
//       return "";
//   }
// }

// function getDayOfWeek(day) {
//   switch (day) {
//     case 0:
//       return "Sun";
//     case 1:
//       return "Mon";
//     case 2:
//       return "Tues";
//     case 3:
//       return "Wed";
//     case 4:
//       return "Thurs";
//     case 5:
//       return "Friday";
//     case 6:
//       return "Saturday";
//     default:
//       return "";
//   }
// }

// function getHumanTime(hour, minutes) {
//   if (minutes === 0) {
//     minutes = "00";
//   }
//   if (hour < 12) {
//     time = hour + ":" + minutes + " AM";
//   } else {
//     if (hour > 12) {
//       hour -= 12;
//     }
//     time = hour + ":" + minutes + " PM";
//   }
//   return time;
// }

// function setupCarousel(pics) {
//   picsHTML = "";
//   for (pic in pics) {
//     $('<div class="item"><img src="img/'+pics[pic].Name +'"><div class="carousel-caption">'+ pics[pic].Caption +'</div>   </div>').appendTo('.carousel-inner');
//   }
//   $('.item').first().addClass('active');
//   $('#carousel-example-generic').carousel();
//   console.log(picsHTML);
// }

function getCards() {
  api_resp = api_call("kitchenuser", {
                      method: "getLast4s",
                      session: Cookies.get("session")
                    });
  if (api_resp.Success) {
    Cookies.set('cards', api_resp.Return)
  }
}