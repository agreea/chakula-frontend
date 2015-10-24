var price = 10;
var seats = 2;
var title = '';
var description = '';
var starts_s = "";
var rsvpBy_s = "";
var published = false;

// Documentation for the datepicker: http://eonasdan.github.io/bootstrap-datetimepicker/
var urlVars = getUrlVars();
var pics = [];

Date.parseDate = function(input, format){
  return moment(input,format).toDate();
};

Date.prototype.dateFormat = function(format){
  return moment(this).format(format);
};

var TitleDescription = React.createClass({
  getInitialState: function() {
    return {title: this.props.title, description: this.props.description};
  },
  titleChanged: function(event) {
    this.setState({title: this.props.title});
    title = event.target.value;
    enableSave();
  },
  descriptionChanged: function(event) {
    this.setState({description: this.props.description});
    description = event.target.value;
    enableSave();
  },
  render: function() {
    return(
      <div>
        <div className="row form-row">
          <div className="col-sm-8 col-sm-offset-2">
            <input className="title-field" id="title" type="text" 
              placeholder="Give your meal a snazzy title." 
              defaultValue={this.state.title} 
              onChange={this.titleChanged}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Description</p>
          </div>
          <div className="col-xs-8">
            <textarea className="text-field" id="description" type="text" rows="8" 
              placeholder="What's in your meal? What inspired you to make it?" 
              defaultValue={this.state.description} 
              onChange={this.descriptionChanged}></textarea>
          </div>
        </div>
      </div>
    );
  }
});

var PriceSeatsRow = React.createClass({
  getInitialState: function() {
    var total_payout = this.props.price * this.props.current_seats;
    return {price: this.props.price, current_seats: this.props.current_seats, total_payout: total_payout};
  },
  priceChanged: function(event) {
    price = event.target.value;
    this.setState({price: price, total_payout: this.state.current_seats * price});
    enableSave();
  },
  seatsChanged: function(seat_count) {
    seats = seat_count;
    this.setState({current_seats: seats, total_payout: this.state.price * seats});
    enableSave();
  },
  render: function() {
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Price per plate</p>
          </div>
          <div className="col-xs-4 col-sm-2">
            <div className="input-group text-field">
              <span className="input-group-addon">$</span>
              <input className="text-field" id="price" type="text" 
                defaultValue={this.state.price} 
                onChange={this.priceChanged} 
                disabled={this.props.published}/>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right" id="guests-pay">Guests pay</p>
          </div>
          <div className="col-xs-5 col-sm-4">
            <p>{"$" + this.state.price * 1.28}</p>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Guest Seats</p>
          </div>
          <div className="col-xs-2 col-sm-1">
            <div className="dropdown">
              <button className="text-field dropdown-toggle" id="seats" 
                type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {this.state.current_seats + "  "}
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                { this.props.possible_seats.map(function(seat_count, i) {
                    return (
                      <li><a className='seat' onClick={this.seatsChanged.bind(this, seat_count)} key={i}>{seat_count}</a></li>
                    );
                  }, this)}
              </ul>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Max pay</p>
          </div>
          <div className="col-xs-8 col-sm-5">
            <p id="payout-val">{"$" + this.state.total_payout}</p>
          </div>
        </div>
      </div>
  );
 }
});
var DatesRow = React.createClass({
  getInitialState: function() {
    return {starts: this.props.starts, rsvp_by: this.props.rsvp_by};
  },
  startsChanged: function(event) {
    this.setState({starts: event.target.value});
    enableSave();
  },
  rsvpChanged: function(event) {
    this.setState({rsvp_by: event.target.value});
    enableSave();  
  },
  render: function() {
    console.log("rendering dates row again");
    console.log(this.state.starts);
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Meal Time</p>
          </div>
          <div className="col-xs-6 col-sm-3">
            <input className="text-field" id="starts-time" type="text" size="20" id="starts-time"
              placeholder="When do you break bread?" 
              defaultValue={this.state.starts} 
              onChange={this.startsChanged}
              disabled={this.props.published}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">RSVP By</p>
          </div>
          <div className="col-xs-6 col-sm-3">
            <input className="text-field" id="rsvp-by-time" type="text" size="40" id="rsvp-by-time"
              placeholder="Rsvp by?" 
              defaultValue={this.state.rsvp_by} 
              onChange={this.rvspChanged}/>
          </div>
        </div>
      </div>
    );
  }
});

var Caption = React.createClass({
  handleChange: function(event) {
    this.setState({value: event.target.value});
    var index = this.props.k;
    pics[index].caption = event.target.value;
    enableSave();
  },
  render: function() {
    return (
      <input className="caption-field" id="caption-field" type="text" placeholder="Caption?" onChange={this.handleChange} 
        k={this.props.k} defaultValue={this.props.caption}/>
    );
  }
});

var Pic = React.createClass({
  deletePic: function() {
    pics.splice(this.props.k, 1);
    enableSave();
    render();
  },
  render: function() {
    var pic = this.props.pic
    var pic_src;
    if (pic.Name.startsWith("data:image")) {
      pic_src = pic.Name;
    } else {
      pic_src = "https://yaychakula.com/img/"+pic.Name;
    }
    return (
      <div className="col-sm-4">
        <div className="pic-card text-center">
          <a className="btn-delete-photo" onClick={this.deletePic}>
            <span className=" glyphicon glyphicon-trash delete-icon" aria-hidden="true"></span>
          </a>
          <img className="img-responsive pic" src={pic_src}/>
          <Caption k={this.props.k} caption={pic.Caption}/>
        </div>
      </div>
    );
  }
});

var PicList = React.createClass({
  render: function() {
    var index = 0;
    var picNodes = this.props.data.map(function (pic) {
      var picNode = <Pic pic={pic} k={index} />;
      index++;
      return (picNode);
    });
    picNodes.push(
      <div className="col-sm-4">
        <div className="pic-card upload-card fileUpload">
          <h1 className="text-center">
            <span className="glyphicon glyphicon-picture upload-icon" aria-hidden="true"></span>
          </h1>
          <input className="upload upload-in-card" id="img-upload" type="file" multiple/>
          <p className="text-center upload-card-text">+Add Picture</p>
        </div>
      </div>);
    return (
      <div className="row">
        <div className="col-xs-4 col-sm-2">
          <p className="form-label text-right">Photos</p>
        </div>
        <div className="col-xs-8">
          <div className="upload-img-form">
            <div className="fileUpload btn-upload btn btn-primary">
              <span>Upload Photos</span>
              <input className="upload" id="img-upload" type="file" multiple/>
            </div>
          </div>
          <hr/>
          <div className="picList row pic-grid">
            {picNodes}
          </div>
        </div>
      </div>
    );
  }
});

var DraftForm = React.createClass({
  render: function() {
    console.log(this.props);
    return(
      <div>
        <TitleDescription title={this.props.title} description={this.props.description} />
        <PriceSeatsRow possible_seats={this.props.possible_seats} price={this.props.price} current_seats={this.props.current_seats} published={this.props.published} />
        <DatesRow starts={this.props.starts} rsvp_by={this.props.rsvp_by} published={this.props.published} />
        <PicList data={this.props.pics} />
      </div>
    );
  }
});

function render() {
  console.log(pics);
  React.render(
    <DraftForm pics={pics}
     possible_seats={[2,3,4,5,6,7,8,9,10,11,12]}
     price={price}
     current_seats={seats}
     title={title}
     description={description} 
     published={published} />,
    document.getElementById('meal-data'));
  initDatepicker('#starts-time', starts_s);
  initDatepicker('#rsvp-by-time', rsvpBy_s);
  $(".upload").change(function(){
    readURL(this);
  });
}

function readURL(input) {
  var files = input.files;
  enableSave();
  for (var i in files) {
    var file = files[i]
    if (!file.type.match('image.*')) {
      continue;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      resize(e);
      console.log(pics);
    }
    reader.readAsDataURL(file);
  }
}

function resize(e){
  var canvas = document.createElement("canvas");
  var img = document.createElement("img");
  img.src = e.target.result;
  console.log(e.target.result);
  var MAX_WIDTH = 800;
  var MAX_HEIGHT = 600;
  var width = img.width;
  var height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  if (width > height && width > MAX_WIDTH) { // if landscape, resize by landscape
    height *= MAX_WIDTH / width;
    width = MAX_WIDTH;
  } else if (height > MAX_HEIGHT) { // if portrait, resize by portrait
      width *= MAX_HEIGHT / height;
      height = MAX_HEIGHT;
  }
  canvas.width = width;
  canvas.height = height;
  console.log("Width: " + width  + ". Height: " + height);
  ctx.drawImage(img, 0, 0, width, height);
  var dataurl = canvas.toDataURL("image/jpg");
  pics.push({Name: dataurl, Caption: ""});
  render();
}

var attemptSave = function() {
  var starts = $('#starts-time').data("DateTimePicker").date();
  var rsvpBy = $('#rsvp-by-time').data("DateTimePicker").date();
  var error_html = "";
  price = parseFloat(price);
  console.log("Here is the price: " + price);
  if (!isFloat(price) && !isInteger(price)) { // TODO: render error field in React
    console.log(price);
    error_html += '<li>' + "Price must be a valid dollar value." + '</li>'
  }
  if (rsvpBy > starts){
    error_html += '<li>' + "Rsvp by time cannot be after meal starts." + '</li>';
  }
  if (rsvpBy < moment()){
    error_html += '<li>' + "Rsvp by time cannot be in the past." + '</li>';
  }
  if (error_html !== "") {
    $('#error-field').html(error_html)
    return;
  }
  console.log("Price is valid!");
  // check price is a number
  // check 
  // if starts OR rsvp are in the past, also throw error
  var data = {
        method: 'saveMealDraft',
        title: title,
        description: description,
        starts: starts.unix(),
        rsvpBy: rsvpBy.unix(),
        price: price,
        seats: seats,
        pics: JSON.stringify(pics),
        session: Cookies.get('session'),
        mealId: urlVars['Id']
  };
  console.log(data);
  $(this).html('<p>Saving </p><span class="spinner"><div class="bounce1">' + 
              '</div><div class="bounce2"></div>' +
              '<div class="bounce3"></div></span>');
  var api_resp = api_call('meal', data);
  $(this).prop('disabled', true);
  if (api_resp.Success) {
    if (!urlVars['Id']) { // reload the page if you haven't done so already
      window.location.replace("https://yaychakula.com/create_meal.html?Id=" + api_resp.Return);
    }
    $(this).css('background-color', '#19a347');
    $(this).text("Saved");
    $(this).prop("disabled", true);
    $(this).html('Saved');
    $('#error-field').hide();
    $('#publish').prop('disabled', false);
  } else {
    $('#error-field').html('<li>' + api_resp.Error + '</li>');
    $(this).prop('disabled', false);
    $(this).html('Save');
  }
  return api_resp;
}

var attemptPublish = function() {
  var starts = $('#starts-time').data("DateTimePicker").date();
  var rsvpBy = $('#rsvp-by-time').data("DateTimePicker").date();
  var error_html = "";
  console.log("Here is the price: " + price);
  price = parseFloat(price);
  // check price is a number
  if (!isFloat(price) && !isInteger(price)) { // TODO: render error field in React
    error_html += '<li>' + "Price must be a valid dollar value." + '</li>'
  }
  // check rsvp by < starts
  if (rsvpBy.unix() > starts.unix()){
    error_html += '<li>' + "Rsvp-by time cannot be after when the meal starts." + '</li>'
  }
  // check title isn't empty
  if (title === "") {
    error_html += '<li>' + "Title cannot be empty." + '</li>'
  }
  // check description isn't empty
  if (description === "") {
    error_html += '<li>' + "Description cannot be empty." + '</li>'
  }
  if (error_html !== "") {
    $('#error-field').html(error_html)
    return;
  }
  // make sure everything is well-formed and then try to save
  var save_result = attemptSave();
  if (!save_result.Success) {
    return;
  }
  var data = {
      method: 'publishMeal',
      session: Cookies.get('session'),
      mealId: urlVars['Id']
    };
  var api_resp = api_call('meal', data);
  console.log(data);
  console.log(api_resp);
  if (api_resp.Success) {
    window.location.replace("https://yaychakula.com/meal.html?Id=" + urlVars['Id']);
  } else {
    $('#error-field').html('<li>' + api_resp.Error + '</li>');
  }
}

// Answer ripped shamelessly
// http://stackoverflow.com/questions/3885817/how-to-check-that-a-number-is-float-or-integer
function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}

function setListeners() {
  console.log("Url vars: " + urlVars['Id']);
  $('#save').click(attemptSave);
  $('#publish').click(attemptPublish);
}

function getMealDraft() {
  if (!urlVars['Id']) {
    return;
  }
  var api_resp = api_call('meal', 
    {method: 'getMealDraft',
    mealId: urlVars['Id'], 
    session: Cookies.get('session')});
  if (api_resp.Success) {
    // TODO: if published, disable: mealtime + price
    var meal_draft = api_resp.Return;
    title = meal_draft.Title;
    description = meal_draft.Description;
    price = meal_draft.Price;
    starts_s = meal_draft.Starts;
    rsvpBy_s = meal_draft.Rsvp_by;
    pics = meal_draft.Pics;
    published = meal_draft.Published;
    console.log(pics);
    $('#save').css('background-color', '#19a347');
    $('#save').text("Saved");
    $('#save').prop("disabled", true);
    $('#publish').prop('disabled', false);
  } else { // redirect home if you can't get the meal
    window.location.replace("https://yaychakula.com/");
    // TODO: show error message....
    // maybe redirect home? or to meal drafts
  }
  console.log(api_resp);
}

var dateChanged = function (e) { 
  enableSave();
  console.log("Date changed called");
}

function initDatepicker(picker_id, default_string) {
  var defaultDate;
  if (default_string == "") {
    defaultDate = moment();
  } else {
    defaultDate = moment(default_string);
  }
  $(picker_id).datetimepicker({sideBySide: true, 
    defaultDate: defaultDate}).on('dp.change', dateChanged);
}

function enableSave(){
  $('#save').prop("disabled", false);
  $('#save').css("background-color", '#5bc0de');
  $('#save').text("Save");
}

$(document).ready(function(){
  $('#nav').load('include/nav_bar.html');
  // $('#guests-pay').text('Guests will pay: $' + price * 1.28);
  // $('#payout-val').text('$' + price * seats);
  if (!urlVars['Id']) {
    $('#publish').prop('disabled', true);
  }
  var session = Cookies.get('session');
  if (session === undefined || session === "") {
    $('#meal-data').hide();
  } else {
    $('#fb').hide();
    getMealDraft();
  }
  render();
  setListeners();
});