var React = require('react');
var TitleDescription = React.createClass({
  getInitialState: function() {
    var d = this.props.data;
    return {
      Title: d.Title, 
      Description: d.Description
    };
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
    var s = this.state;
    return(
      <div>
        <div className="row form-row">
          <div className="col-sm-8 col-sm-offset-2">
            <input className="title-field" id="Title" type="text" 
              placeholder="Give your meal a snazzy title." 
              value={s.Title} 
              onChange={this.handleChange}/>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Description</p>
          </div>
          <div className="col-xs-8">
            <textarea className="text-field" id="Description" type="text" rows="8" 
              placeholder="What's in your meal? What inspired you to make it?" 
              value={s.Description} 
              onChange={this.handleChange}></textarea>
          </div>
        </div>
      </div>
    );
  }
});

var PriceSeatsRow = React.createClass({
  getInitialState: function() {
    var d = this.props.data;
    return {
      Price: d.Price, 
      // Capacity: d.Capacity
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
  getPriceWithCommission: function() {
    var price = this.state.Price;
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
            <p className="text-right">Price per spot</p>
          </div>
          <div className="col-xs-4 col-sm-2">
            <div className="input-group text-field">
              <span className="input-group-addon">$</span>
              <input className="text-field" id="Price" type="text" 
                value={s.Price} 
                onChange={this.handleChange} 
                disabled={this.props.data.published}/>
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right" id="guests-pay">Guests pay</p>
          </div>
          <div className="col-xs-5 col-sm-4">
            <p>{"$" + this.getPriceWithCommission()}</p>
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
    var pic = this.props.pic;
    var pic_src = (pic.Name.startsWith("data:image"))?
      pic.Name : "https://yaychakula.com/img/"+ pic.Name;
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
    var pics = this.state.Pics;
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
    var update_state = {Pics: pics};
    this.setState(update_state);
    this.props.handlePicsChange(update_state);
  },
  deletePic: function(index) {
    var pics = this.state.Pics;
    pics.splice(index, 1);
    var update_state = {Pics: pics};
    this.setState(update_state);
    this.props.handlePicsChange(update_state);
  },
  getInitialState: function() {
    return ({Pics: this.props.data.Pics});
  },
  render: function() {
    var deletePic = this.deletePic;
    var picNodes = this.state.Pics.map(function (pic, index) {
      return <Pic pic={pic} k={index} deletePic={deletePic}/>;
    });
    var picRows = [], // two dimensional array. Each row contains 3 pic items
        thisRow = []; // second dimension of the array. Once a row stores 3 pics, you add it to the pic rows
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
  mixins: [require('react-router').History],
  getInitialState: function() {
    return({
      Title: '',
      Description: '',
      Price: '',
      Pics: [],
      Published: '',
      saveDisabled: false,
      publishDisabled: false,
      // possibleSeats: [2,3,4,5,6,7,8,9,10,11,12]
    })
  },
  handleInputChange: function(key_val) {
    key_val["saveDisabled"] = false;
    this.setState(key_val);
    console.log(this.state);
  },
  getMealDraft: function() {
    var api_resp = api_call('meal', {
        method: 'getMealDraft',
        mealId: this.props.params.id, 
        session: Cookies.get('session')
      });
    if (!api_resp.Success) {
      this.history.pushState(null, "/my_meals");
      return;
    }
    var d = api_resp.Return;
    d["saveDisabled"] = true,
    d["publishDisabled"] = true;
    this.setState(d);
    console.log(this.state);
  },
  getMealCopy: function () {
    var api_resp = api_call('meal',{
        method: 'getMealDraft',
        mealId: this.props.location.query.copy, 
        session: Cookies.get('session')
      });
    if (!api_resp.Success)
      return;
    var d = api_resp.Return;
    d["saveDisabled"] = false,
    d["publishDisabled"] = false,
    d["Published"] = false; // override the response from the server because you are saving a copy
    this.setState(d);
  },
  componentWillMount: function() {
    if (!this.props.params.id && !this.props.location.query.copy) {
      var api_resp = api_call("host", {method: "getHost", session: Cookies.get("session")});
      if (api_resp.Success)
        this.setState(api_resp.Return);
      return;
    }
    if (this.props.params.id)
      this.getMealDraft();
    else if (this.props.location.query.copy)
      this.getMealCopy();
  },
  // componentDidMount: function(){
  //   this.initDatepicker('#Starts', this.state.Starts);
  //   this.initDatepicker('#Rsvp_by', this.state.Rsvp_by);
  // },
  // initDatepicker: function(picker_id, default_string) {
  //   var defaultDate = (default_string == "")? moment() : moment(default_string);
  //   $(picker_id).datetimepicker({sideBySide: true, defaultDate: defaultDate})
  //     .on('dp.change', this.setState({saveDisabled: false}));
  // },
  validateForSave: function() {
    var errors = [],
        s = this.state;
        // starts = $('#Starts').data("DateTimePicker").date(),
        // rsvpBy = $('#Rsvp_by').data("DateTimePicker").date();
    if (!isFinite(s.Price)) errors.push("Price must be a valid dollar value.");
    this.setState({errors: errors});
    return errors.length === 0;
  },
  attemptSave: function(flag) { // flag is optional arg used by publish to prevent a forward
    if (!this.validateForSave())
      return;
    var s = this.state;
        // starts = $('#Starts').data("DateTimePicker").date(),
        // rsvpBy = $('#Rsvp_by').data("DateTimePicker").date();
    var api_data = this.state;
    api_data["Meal_id"] = (this.props.params.id)? this.props.params.id : "",
    api_data["Pictures"] = JSON.stringify(s.Pics), 
    // NOTE: you have to change the key for pics, because overwriting "Pics" creates subtle bugs caused by JS pass-by-sharing
    api_data["Session"] = Cookies.get('session'),
    api_data["method"] = "saveMealDraft";
    console.log(api_data);
    var api_resp = api_call('meal', api_data);
    this.setState({saveDisabled: true});
    var errors = [];
    if (!api_resp.Success)
      errors.push(api_resp.Error)
    this.setState({
      errors: errors, 
      publishDisabled: false,
      saveDisabled: api_resp.Success,
    });
    if (!this.props.params.id && flag !== "publish") // reload the page if you haven't done so already
        window.location.assign("https://yaychakula.com/create_meal/" + api_resp.Return);
    return api_resp;
  },
  validateForPublish: function() { // returns true if meal is well formed and ready to publish
    var s = this.state,
        errors = [];
    if (!isFinite(s.Price)) errors.push("Price must be a valid dollar value.");
    if (s.Title === "") errors.push("Title cannot be empty.")
    if (s.Description === "") errors.push("Description cannot be empty.");
    if (!s.Pics || s.Pics.length < 1) errors.push("Upload at least one picture before publishing your meal");
    this.setState({errors: errors});
    return errors.length == 0;
  },
  publishMeal: function(mealId) {
    var api_resp = api_call('meal', {
        method: 'publishMeal',
        session: Cookies.get('session'),
        mealId: mealId
      });
    if (api_resp.Success)
        window.location.assign("https://yaychakula.com/meal/" + api_resp.Return);
  },
  attemptPublish: function() {
    if (!this.validateForPublish())
      return;
    var save_result = this.attemptSave("publish"); // flag true for "publish"
    if (save_result.Success)
      this.publishMeal(save_result.Return)
  },
  render: function() {
    var s = this.state;
    var errorElements = [];
    if (s.errors) {
      errorElements = s.errors.map(function(error){ return(<li>{error}</li>) })
    }
    return(
      <div id="create-meal">
        <TitleDescription
          data={s} 
          handleChange={this.handleInputChange} />
        <PriceSeatsRow 
          handleChange={this.handleInputChange}
          data={s} />
        <PicList data={s} handlePicsChange={this.handleInputChange}/>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <ul className="error-field" id="error-field">
              {errorElements}
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
function isInteger(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return n === Number(n) && n % 1 !== 0;
}