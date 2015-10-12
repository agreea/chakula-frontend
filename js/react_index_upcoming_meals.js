var api_resp = api_call("meal", {
  method: "getUpcomingMeals",
});
if (api_resp.Success) {
  // populate that shit
  var Meal = React.createClass({
    render: function() {
       return (
        <div className="card col-sm-6 col-xs-12">
             <a href={"http://yaychakula.com/meal.html?Id=" + this.props.Id} target="new_blank">
            <div className="card-image">
                <img className="img-responsive" src={'img/' + this.props.Pic}/>
                <span className="card-title">
                    {this.props.Title + ' - ' + this.props.Price}
                </span>
            </div>
            <div className="card-action">
                <a href={"http://yaychakula.com/meal.html?Id=" + this.props.Id} target="new_blank">{getHumanDate(this.props.Starts)}</a>
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

// Takes date as iso8601 formatted string, returns 8:30 PM Sun, October 15
function getHumanDate(starts) {
  var date_parse = Date.parseDate(starts); // iso8601 --> unix ts milliseconds
  var date = new Date(date_parse); // unix ts --> JS Date object
  var month = getShortMonth(date.getMonth()+1);
  var date_day = date.getDate(); // 15
  var week_day = getDayOfWeek(date.getDay()); // Sun
  var time_text = getHumanTime(date.getHours(), date.getMinutes()); // 8:30 PM
  var final_date_text = time_text + " " + week_day + ", " + month + " " + date_day;
  return final_date_text;
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
      return "Fri";
    case 6:
      return "Sat";
    default:
      return "";
  }
}
// returns 8:00 PM
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
