// getMeal();
function getMeal(){
  urlVars = getUrlVars();
  api_resp = api_call("meal", {
                      method: "getMeal",
                      session: Cookies.get("session"),
                      mealId: urlVars["Id"],
                    });
  if (api_resp.Success) {
    meal_data = api_resp.Return;
    $('#meal-title').text(meal_data.Title);
    $('#meal-description').text(meal_data.Description);
    $('#host-name').text(meal_data.Host_name);
    $('#host-pic').attr("src", meal_data.Host_pic);
    $('#open-spots').text(meal_data.Open_spots);
    request_button = $('#request-meal-btn');
    // TODO: show meal time
    // TODO: show RSVP-by-time
    // TODO: show pics
    // Set the button text, text color, and background color according to meal status
    if (meal_data.Status != "NONE") {
      request_button.text(meal_data.Status);
      request_button.prop('disabled', true);
    } else {
      request_button.text("Request Meal - $" + meal_data.Price);
    }
    if (meal_data.Status === "PENDING") {
      request_button.css("background-color", "#8cd3e8");
      request_button.css("color", "#2e464c");
    } else if (meal_data.Status === "ATTENDING") {
      request_button.html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Attending");
      request_button.css("background-color", "#19a347");
      request_button.css("color", "#fff");
    } else if (meal_data.Status === "DECLINED") {
      request_button.css("background-color", "#71ccdb")
      request_button.css("color", "#233f44");
    } else if (meal_data.Open_spots === 0) {
      request_button.prop('disabled', true);
      request_button.text("Sold out!");
    }
    start = Date.parse(meal_data.Start);
    console.log("Start date: " + start);
    console.log("RSVP by: " + meal_data.Rsvp_by);

    rsvp_by = Date.parse(meal_data.Rsvp_by);
    processDates(start, rsvp_by);
          /* 

  Title       string
  Description   string
  // Time       time.Time (?)
  // Rsvp_by      time.Time (?)
  Host_name     string
  Host_pic    string
  Open_spots    int64
  Price     float64
  Status      string
  Pics      []string    
          */       
  }
}

function processDates(start_time, rsvp_by) {
  // start time:
  // get the time in hours & minutes. Set that to the main #
  // get the time in days, month, and time. Set that to the subtext
  date = new Date(start_time);
  month = getShortMonth(date.getMonth()+1);
  console.log("Month: " + date.getMonth());
  console.log("Date: " + date.getDate());
  console.log("Day: " + date.getDay());
  date_day = date.getDate();
  week_day = date.getDay();
  time_text = getHumanTime(date.getHours(), date.getMinutes());
  time_subtext = "on " + week_day + ", " + month + " " + date_day;
  $('#meal-time').text(time_text);
  $('#meal-time-subtext').text(time_subtext);
  // RSVP time:
  // get the current time, run a diff
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

function getHumanTime(hour, minutes) {
  if (hour < 12) {
    time = hour + ":" + minutes + " AM";
  } else {
    time = (hour - 12) + ":" + minutes + " PM";
  }
  return time;
}

function getCards() {
  api_resp = api_call("kitchenuser", {
                      method: "getLast4s",
                      session: Cookies.get("session")
                    });
  if (api_resp.Success) {
    Cookies.set('cards', api_resp.Return)
  }
}