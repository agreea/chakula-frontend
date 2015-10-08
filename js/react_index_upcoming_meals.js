var api_resp = api_call("meal", {
  method: "getUpcomingMeals",
});
if (api_resp.Success) {
  // populate that shit
  var Meal = React.createClass({
    render: function() {
       return (
        <div className="card">
             <a href={"http://yaychakula.com/meal.html?Id=" + this.props.Id} target="new_blank">
            <div className="card-image">
                <img className="img-responsive" src={'img/' + this.props.Pic}/>
                <span className="card-title">
                    {this.props.Title + ' - ' + this.props.Price}
                </span>
            </div>
            <div className="card-action">
                <a href={"http://yaychakula.com/meal.html?Id=" + this.props.Id} target="new_blank">7PM Saturday, October 3rd</a>
                <a href={"http://yaychakula.com/meal.html?Id=" + this.props.Id} target="new_blank">{this.props.Open_spots + ' Seats Available'}</a>
            </div>
            </a>
        </div>            
       ); 
    }
    });

   
  var Meals = React.createClass({
    render: function() {
      var mealNodes = this.props.data.map(function (meal) {
        return (
          <Meal Id={meal.Id} 
            Pic={meal.Pics[0].Name} 
            Price={meal.Price} 
            Title={meal.Title} 
            Open_spots={meal.Open_spots} />
        );
      });
      return (
        <div className="Meals">
          {mealNodes}
        </div>
      );
    }
  });
  React.render(
    <Meals data={api_resp.Return}/>,
      document.getElementById('meals')
    );
}

function processDates(start_time, rsvp_by) {
  // start time:
  // get the time in hours & minutes. Set that to the main #
  // get the time in days, month, and time. Set that to the subtext
  var date = new Date(start_time);
  var month = getShortMonth(date.getMonth()+1);
  console.log("Month: " + date.getMonth());
  console.log("Date: " + date.getDate());
  console.log("Day: " + date.getDay());
  var date_day = date.getDate();
  var week_day = getDayOfWeek(date.getDay());
  var time_text = getHumanTime(date.getHours(), date.getMinutes());
  var time_subtext = "on " + week_day + ", " + month + " " + date_day;
  $('#meal-time').text(time_text);
  $('#meal-time-subtext').text(time_subtext);
  // RSVP time:
  // get the current time, run a diff
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var time_left = rsvp_by - Date.now()
  // if rsvp_by - now > 24 hours ==> "# days left"
  // else if rsvp_by - now > 1 hour ==> "# hours left" (text is yellow)
  // else if rsvp_by - now > 1 minute ==> "# minutes left" (text is red)
  // else ==> "Closed" (text is grey)
}

function getShortMonth(month) {
  switch (month) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3: 
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
}

function getDayOfWeek(day) {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tues";
    case 3:
      return "Wed";
    case 4:
      return "Thurs";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "";
  }
}

function getHumanTime(hour, minutes) {
  if (minutes === 0) {
    minutes = "00";
  }
  if (hour < 12) {
    var time = hour + ":" + minutes + " AM";
    return time;
  } else {
    var time = (hour - 12) + ":" + minutes + " PM";
    return time;
  }
}
