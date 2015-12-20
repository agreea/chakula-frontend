var React = require('react');
var TitleDescription = React.createClass({
  getInitialState: function() {
    return {title: this.props.title, description: this.props.description};
  },
  handleChange: function(e) {
    var obj = {},
        key = e.target.id,
        val = e.target.value;
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    return(
      <div>
        <div className="row form-row">
          <div className="col-sm-8 col-sm-offset-2">
            <input className="title-field" id="title" type="text" 
              placeholder="Give your meal a snazzy title." 
              value={this.state.title} 
              onChange={this.handleChange}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Description</p>
          </div>
          <div className="col-xs-8">
            <textarea className="text-field" id="description" type="text" rows="8" 
              placeholder="What's in your meal? What inspired you to make it?" 
              value={this.state.description} 
              onChange={this.handleChange}></textarea>
          </div>
        </div>
      </div>
    );
  }
});

var PriceSeatsRow = React.createClass({
  getInitialState: function() {
    return {
      price: this.props.price, 
      seats: this.props.seats
    };
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value;
    var obj = {};
    obj[key] = val;
    console.log(obj);
    this.setState(obj);
    this.props.handleChange(obj);
  },
  getPriceWithCommission: function(price) {
    if(price <= 15)
      price *= 1.28
    else if (price < 100) {
      var commission_percent = (-0.152941 * price + 30.2941)/100
      price *= (1 + commission_percent)
    } else 
      price *= 1.15
    return Math.round(price * 100)/100;
  },
  render: function() {
    var s = this.state;
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
                value={s.price} 
                onChange={this.handleChange} 
                disabled={this.props.published}/>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right" id="guests-pay">Guests pay</p>
          </div>
          <div className="col-xs-5 col-sm-4">
            <p>{"$" + this.getPriceWithCommission(s.price)}</p>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Guest Seats</p>
          </div>
          <select value={s.seats} className="col-xs-2 col-sm-1" id="seats" onChange={this.handleChange}>
                {this.props.possibleSeats.map(function(seat_count, i) {
                    return (
                      <option value={seat_count}>{seat_count}</option>
                    );
                  })}
          </select>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Max pay</p>
          </div>
          <div className="col-xs-8 col-sm-5">
            <p id="payout-val">{"$" + s.seats * s.price}</p>
          </div>
        </div>
      </div>
  );
 }
});
var DatesRow = React.createClass({
  getInitialState: function() {
    return {starts: this.props.starts, rsvpBy: this.props.rsvp_by};
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value;
    var obj = {};
    obj[key] = val;
    this.setState(obj);
    this.props.handleChange(obj);
  },
  render: function() {
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Meal Time</p>
          </div>
          <div className="col-xs-6 col-sm-3">
            <input className="text-field" type="text" size="20" id="starts"
              placeholder="When do you break bread?" 
              value={this.state.starts} 
              onChange={this.handleChange}
              disabled={this.props.published}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">RSVP By</p>
          </div>
          <div className="col-xs-6 col-sm-3">
            <input className="text-field" type="text" size="40" id="rsvpBy"
              placeholder="Rsvp by?" 
              value={this.state.rsvpBy} 
              onChange={this.handleChange}/>
          </div>
        </div>
      </div>
    );
  }
});

var Pic = React.createClass({
  deletePic: function() {
    this.props.deletePic(this.props.k);
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
        </div>
      </div>
    );
  }
});

var PicList = React.createClass({
  photoUpload: function(e){
    console.log(e);
    var files = e.target.files;
    for (var i in files) {
      console.log("i:" + i);
      console.log(files[i]);
      var file = files[i]
      if (!/image.*/.test(file.type)) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = this.onload;
      reader.readAsDataURL(file);
    }
  },
  onload: function(e){
    var img = document.createElement("img");
    var pics = this.state.pics;
    var updatePics = this.updatePics;
    img.onload = function(event) {
      var canvas = document.createElement("canvas");
      var MAX_WIDTH = 1000;
      var MAX_HEIGHT = 750;
      var width = img.width;
      var height = img.height;
      if (width > height && width > MAX_WIDTH) { // if landscape, resize by landscape
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      } else if (height > MAX_HEIGHT) { // if portrait, resize by portrait
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      pics.push({Name: canvas.toDataURL("image/jpeg"), Caption: ""});
      updatePics(pics);
    };
    img.src = e.target.result;
  },
  updatePics: function(pics) {
    this.setState({pics: pics});
    this.props.handlePicsChange(this.state.pics);
  },
  deletePic: function(index) {
    var pics = this.state.pics;
    pics.splice(this.props.k, 1);
    this.setState({pics: pics});
    this.props.handlePicsChange(this.state.pics);
  },
  getInitialState: function() {
    return ({pics: this.props.pics});
  },
  render: function() {
    var deletePic = this.deletePic;
    var picNodes = this.state.pics.map(function (pic, index) {
      return <Pic pic={pic} k={index} deletePic={deletePic}/>;
    });
    var picRows = [], // two dimensional array. Each row contains 3 pic items
        thisRow = []; // second dimension of the array. Once a row stores 3 pics, you add it to the pic rows
    console.log("Pic node length: " + picNodes.length);
    for (var i in picNodes) {
      // add this row to pic rows if it's full
      if (thisRow.length === 3) {
        var fullRow = thisRow;
        picRows.push(<div className="row">
          {fullRow}
        </div>);
        thisRow = []; // empty the array
      }
      thisRow.push(picNodes[i]);
      if (i == (picNodes.length - 1)) { // if this is the last pic, add the current row once you've added the pic
        picRows.push(<div className="row">{thisRow}</div>);
      }
    }
    return (
      <div className="row">
        <div className="col-xs-4 col-sm-2">
          <p className="form-label text-right">Photos</p>
        </div>
        <div className="col-xs-8">
          <div className="upload-img-form">
            <div className="fileUpload btn-upload btn btn-primary">
              <span>Upload Photos</span>
              <input className="upload" id="img-upload" type="file" multiple onChange={this.photoUpload}/>
            </div>
          </div>
          <hr/>
          <div className="picList row pic-grid">
            {picRows}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = React.createClass({
  handleInputChange: function(key_val) {
    key_val["saveDisabled"] = false;
    this.setState(key_val);
    console.log(key_val);
  },
  handlePicsChange: function(pics) {
    this.setState({
      pics: pics,
      saveDisabled: false
    });
  },
  componentWillMount: function() {
    if (!this.props.params.id) 
      return;
    var api_resp = api_call('meal',{
        method: 'getMealDraft',
        mealId: this.props.params.id, 
        session: Cookies.get('session')
      });
    if (!api_resp.Success)
      return;
    var d = api_resp.Return;
    this.setState({
      title: d.Title,
      description: d.Description,
      price: d.Price,
      seats: d.Capacity,
      pics: d.Pics,
      rsvpBy: d.Rsvp_by,
      starts: d.Starts,
      published: d.Published,
      saveDisabled: true,
      publishDisabled: false,
      saveText: "Saved",
      possibleSeats: [2,3,4,5,6,7,8,9,10,11,12]
    });
  },
  componentDidMount: function(){
    this.initDatepicker('#starts', this.state.starts);
    this.initDatepicker('#rsvpBy', this.state.rsvpBy);
  },
  initDatepicker: function(picker_id, default_string) {
    var defaultDate = (default_string == "")? moment() : moment(default_string);
    $(picker_id).datetimepicker({sideBySide: true, defaultDate: defaultDate})
      .on('dp.change', this.setState({saveDisabled: false}));
  },
  attemptSave: function() {
    var errors = [],
        s = this.state,
        starts = $('#starts').data("DateTimePicker").date(),
        rsvpBy = $('#rsvpBy').data("DateTimePicker").date();
    if (!isFloat(s.price) && !isInteger(s.price)) errors.push("Price must be a valid dollar value.");
    if (rsvpBy > starts) errors.push("Rsvp by time cannot be after meal starts.");
    if (rsvpBy < moment()) errors.push("Rsvp by time cannot be in the past.");
    if (starts < moment()) errors.push("Start time cannot be in the past.");
    this.setState({errors: errors})
    if(errors.length > 0)
      return;
    var mealId = (this.props.params.id)? this.props.params.id : "";
    var api_resp = api_call('meal', {
          method: 'saveMealDraft',
          title: s.title,
          description: s.description,
          starts: starts.unix(),
          rsvpBy: rsvpBy.unix(),
          price: s.price,
          seats: s.seats,
          pics: JSON.stringify(s.pics),
          session: Cookies.get('session'),
          mealId: mealId
    });
    this.setState({saveDisabled: true});
    if (!api_resp.Success) {
      this.setState({
        errors: [api_resp.Error],
        saveDisabled: false
      });
      return;
      // TODO: get this into the less for create_meal
      // $(this).css('background-color', '#19a347');
      // $(this).text("Saved");
      // $(this).prop("disabled", true);
      // $(this).html('Saved');
    }
    this.setState({
      errors: [], 
      publishDisabled: false,
      saveDisabled: true,
      saveText: "Saved"
    });
    if (!this.props.params.id)// reload the page if you haven't done so already
        window.location.replace("https://yaychakula.com/#/create_meal/" + api_resp.Return);
    return api_resp;
  },
  attemptPublish: function() {
    var starts = $('#starts').data("DateTimePicker").date(),
        rsvpBy = $('#rsvpBy').data("DateTimePicker").date();
    var errors = [];
    if (!isFloat(price) && !isInteger(price)) errors.push("Price must be a valid dollar value.");
    if (rsvpBy.unix() > starts.unix()) errors.push("Rsvp-by time cannot be after when the meal starts.");
    if (starts < moment()) errors.push("Start time cannot be in the past.");
    if (rsvpBy < moment()) errors.push("Rsvp-by time cannot be in the past.");
    if (this.state.title === "") errors.push("Title cannot be empty.")
    if (this.state.description === "") errors.push("Description cannot be empty.");
    if (errors.length > 0) {
      this.setState({errors: errors});
      return;
    }
    // make sure everything is well-formed and then try to save
    var save_result = this.attemptSave();
    if (!save_result.Success)
      return;
    var api_resp = api_call('meal', {
        method: 'publishMeal',
        session: Cookies.get('session'),
        mealId: this.props.params.id
      });
    if (api_resp.Success)
        window.location.replace("https://yaychakula.com/#/meal/" + api_resp.Return);
  },
  render: function() {
    var s = this.state;
    var errors = [];
    if (s.errors) {
      errors = s.errors.map(function(error){ return(<li>{error}</li>) })
    }
    console.log("SaveDisabled? " + s.saveDisabled);
    return(
      <div id="create-meal">
        <TitleDescription 
          title={s.title} 
          description={s.description} 
          handleChange={this.handleInputChange} />
        <PriceSeatsRow 
          seats={s.seats}
          handleChange={this.handleInputChange}
          price={s.price} 
          possibleSeats={s.possibleSeats}
          published={s.published} />
        <DatesRow starts={s.start} rsvp_by={s.rsvpB} published={s.published} />
        <PicList pics={s.pics} handlePicsChange={this.handlePicsChange}/>
        <div className="col-md-8 col-md-offset-2">
          <div>
            <ul className="error-field" id="error-field">
              {errors}
            </ul>
            <button 
              className="brand-btn btn-info btn-lg btn" 
              id="save" 
              type="button"
              disabled={s.saveDisabled} onClick={this.attemptSave}>{(s.saveDisabled)? "Saved" : "Save"}</button>
            <button 
              className="brand-btn btn-info btn-lg btn" 
              id="publish" 
              type="button"
              disabled={s.publishDisabled} onClick={this.attemptPublish}>Publish</button>
          </div>
        </div>
      </div>
    );
  }
});

// Answer ripped shamelessly
// http://stackoverflow.com/questions/3885817/how-to-check-that-a-number-is-float-or-integer
function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}