var TitleDescription = React.createClass({
  getInitialState: function() {
    return {title: this.props.title, description: this.props.description};
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.val;
    this.setState({key: val});
    this.props.handleChange({key: val});
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
      seats: this.props.seats,
    };
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.val;
    this.setState({key: val});
    this.props.handleChange({key: val});
  }
  getPriceWithCommission: function(price) {
    if(price <= 15) {
      return price * 1.28
    } else if (price < 100) {
      var commission_percent = (-0.152941 * price + 30.2941)/100
      return price * (1 + commission_percent)
    }
    return price * 1.15
  },
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value;
    this.setState({key: val});
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
                defaultValue={s.price} 
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
          <select value={s.seats} className="col-xs-2 col-sm-1" id="seats">
                {s.possible_seats.map(function(seat_count, i) {
                    return (
                      <option value={seat_count}>{seat_count}</option>
                    );
                  })}
            </div>
          </div>
        </div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Max pay</p>
          </div>
          <div className="col-xs-8 col-sm-5">
            <p id="payout-val">{"$" + s.current_seats * this.getPriceWithCommission(s.price)}</p>
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
  handleChange: function(e) {
    var key = e.target.id,
        val = e.target.value;
    this.setState({key: val});
    this.props.handleChange(e);
  },
  render: function() {
    return (
      <div>
        <div className="row form-row">
          <div className="col-xs-4 col-sm-2 form-label">
            <p className="text-right">Meal Time</p>
          </div>
          <div className="col-xs-6 col-sm-3">
            <input className="text-field" id="starts-time" type="text" size="20" id="starts"
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
            <input className="text-field" id="rsvp-by-time" type="text" size="40" id="rsvpBy"
              placeholder="Rsvp by?" 
              value={this.state.rsvpBy} 
              onChange={this.handleChange}/>
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
    this.props.delete(this.props.k);
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
  photoUpload: function(input){
    var files = input.files;
    enableSave();
    for (var i in files) {
      var file = files[i]
      if (!file.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = this.resize;
      reader.readAsDataURL(file);
    }    
  },
  resize: function(e){
    var img = document.createElement("img");
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
      var pics = this.state.pics;
      pics.push({Name: canvas.toDataURL("image/jpeg"), Caption: ""});
      this.setState({pics: pics});
      this.props.handlePicsChange(this.state.pics);
    };
    img.src = e.target.result;
  },
  delete: function(index) {
    var pics = this.state.pics;
    pics.splice(this.props.k, 1);
    this.setState({pics: pics});
    this.props.handlePicsChange(this.state.pics);
  },
  render: function() {
    var picNodes = this.props.data.map(function (pic, index) {
      return <Pic pic={pic} k={index} delete={this.delete}/>;
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

var DraftForm = React.createClass({
  handleInputChange: function(e) {
    var key = e.target.id;
    var val = e.target.value;
    this.setState({key: val});
  },
  handlePicsChange: function(pics) {
    this.setState({pics: pics});
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
      current_seats: d.Capacity,
      pics: d.Pics,
      rsvpBy: d.Rsvp_by,
      starts: d.Starts,
      published: d.Published,
      saveDisabled: true,
      publishDisabled: false,
      saveText: "Saved"
    });
  },
  componentDidMount: function(){
    this.initDatepicker('#starts', this.state.starts);
    this.initDatepicker('#rsvpBy', this.state.rsvpBy);
  },
  initDatepicker: function(picker_id, default_string) {
    var defaultDate = (default_string == "")? moment() : moment(default_string);
    $(picker_id).datetimepicker({sideBySide: true, defaultDate: defaultDate})
      .on('dp.change', this.setState({saveEnabled: true}));
  },
attemptSave: function() {
  var error_html = [],
      s = this.state,
      starts = $('#starts-time').data("DateTimePicker").date(),
      rsvpBy = $('#rsvp-by-time').data("DateTimePicker").date();
  if (!isFloat(s.price) && !isInteger(s.price)) errors.push("Price must be a valid dollar value.");
  if (rsvpBy > starts) errors.push("Rsvp by time cannot be after meal starts.");
  if (rsvpBy < moment()) errors.push("Rsvp by time cannot be in the past.");
  this.setState({errors: errors})
  if(errors.length > 0)
    return;
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
        mealId: urlVars['Id']
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
}

attemptPublish: function() {
  var starts = $('#starts-time').data("DateTimePicker").date(),
      rsvpBy = $('#rsvp-by-time').data("DateTimePicker").date();
  var errors = [];
  if (!isFloat(price) && !isInteger(price)) errors.push("Price must be a valid dollar value.");
  if (rsvpBy.unix() > starts.unix()) errors.push("Rsvp-by time cannot be after when the meal starts.");
  if (title === "") errors.push("Title cannot be empty.")
  if (description === "") errors.push("Description cannot be empty.");
  if (errors.length > 0) {
    this.setState({errors: errors});
    return;
  }
  // make sure everything is well-formed and then try to save
  var save_result = attemptSave();
  if (!save_result.Success)
    return;
  var api_resp = api_call('meal', {
      method: 'publishMeal',
      session: Cookies.get('session'),
      mealId: urlVars['Id']
    });
  if (api_resp.Success)
      window.location.replace("https://yaychakula.com/#/meal/" + api_resp.Return);
},
  render: function() {
    var s = this.state;
    return(
      <div>
        <TitleDescription 
          title={s.title} 
          description={s.description} 
          handleChange={this.handleChange} />
        <PriceSeatsRow 
          possible_seats={s.possible_seats}
          handleChange={this.handleChange}
          price={s.price} 
          current_seats={s.current_seats} 
          published={s.published} />
        <DatesRow starts={s.starts} rsvp_by={s.rsvp_by} published={s.published} />
        <PicList data={s.pics} />
        <div className="col-md-8 col-md-offset-2">
          <div>
            <ul className="error-field" id="error-field">
              {s.errors.map(function(error){ return(<li>{error}</li>) })}
            </ul>
            <button 
              className="brand-btn btn-info btn-lg btn" 
              id="save" 
              type="button"
              disabled={s.saveDisabled} onClick={attemptSave}>{s.saveText}</button>
            <button 
              className="brand-btn btn-info btn-lg btn" 
              id="publish" 
              type="button"
              disabled={s.publishDisabled} onClick={attemptPublish}>Publish</button>
          </div>
        </div>
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

// Answer ripped shamelessly
// http://stackoverflow.com/questions/3885817/how-to-check-that-a-number-is-float-or-integer
function isFloat(n) {
    return n === +n && n !== (n|0);
}

function isInteger(n) {
    return n === +n && n === (n|0);
}