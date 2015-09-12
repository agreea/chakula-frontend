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
    $('#host-pic').text(meal_data.Host_pic);
    // $('#price').text(meal_data.Price)
    $('#open-spots').text(meal_data.Open_spots);
    request_button = $('#request-meal-btn');
    // TODO: show meal time
    // TODO: show RSVP-by-time
    // TODO: show pics
    // Set the button text, text color, and background color according to meal status
    if (meal_data.Status != "NONE") {
      request_button.text(meal_data.Status);
      request_button.prop('disabled', true);
    }
    if (meal_data.Status === "PENDING") {
      request_button.css("background-color", "#8cd3e8");
      request_button.css("color", "#2e464c");
    } else if (meal_data.Status === "ATTENDING") {
      request_button.css("background-color", "#19a347");
      request_button.css("color", "#fff");
    } else if (meal_data.Status === "DECLINED") {
      request_button.css("background-color", "#71ccdb")
      request_button.css("color", "#233f44");
    } else if (meal_data.Open_spots === 0) {
      request_button.prop('disabled', true);
      request_button.text(meal_data.Status);
    }
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