var React = require('react'),
    Link = require('react-router').Link,
    Modal = require('./modal.js'),
    ProfImg = require('./prof_img.js'),
    AddPopupRow = require('./add_popup.js'),
    PopupRow = require('./popup_row.js');

var PopupsList = React.createClass({
  getInitialState: function(){
    var popups = this.props.data.Popups;
    return {popups: popups}
  },
  handleAddPopupSuccess: function(popup) {
    var popups = this.state.popups;
    popups.push(popup);
    this.setState({popups: popups});
  },
  render: function() {
    var d = this.props.data,
        popups = this.state.popups;
      popupsNodes = d.Popups.map(function(popup, key) {
        return <PopupRow data={popup} key={key} />;
      });
      return (
        <div className="row">
          <div className="col-xs-9 col-xs-offset-3">
            <h4>Popups</h4>
            {popupsNodes}
            <AddPopupRow data={d} handleAddPopupSuccess={this.handleAddPopupSuccess}/>
          </div>
        </div>
      )
  },
});

module.exports = React.createClass({
  getInitialState: function() {
      return {
        delete_error: "", 
        Published: this.props.data.Published,
        errors: []
      };
  },
  publishMeal: function() {
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by),
        errors = [];
    if (rsvpBy > starts) errors.push("Rsvp by time cannot be after meal starts.");
    if (rsvpBy < moment()) errors.push("Rsvp by time cannot be in the past.");
    if (starts < moment()) errors.push("Start time cannot be in the past.");
    if (d.Description.length < 1) errors.push("Add a description");
    if (d.Title.length < 1) errors.push("Add a title");
    if (d.Description.length < 1) errors.push("Please add a description");
    if (d.Pics.length < 1) errors.push("You must add pictures before you can publish your meal");
    this.setState({errors: errors});
    if (errors.length > 0) 
      return;
    var api_resp = api_call('meal',{
      method: "publishMeal", 
      mealId: this.props.data.Id, 
      session: Cookies.get("session")
    });
    if (api_resp.Success) {
      this.setState({Published: true});
    } else {
      this.setState({errors: [api_resp.Error]})
    }
  },
  deleteMeal: function() {
    var d = this.props.data;
    var api_resp = api_call('meal', {
      method: 'deleteMeal', 
      session: Cookies.get('session'), 
      mealId: d.Id
    });
    if (!api_resp.Success){
      this.setState({delete_error: resp.Error});
      return;
    }
    this.props.handleMealDelete(d.Id);
    $('#deleteMeal' + d.Id).modal('hide');
    // launch the modal
    // upon confirm, delete the meal
  },
  renderDeleteModal: function() {
    var d = this.props.data;
    var modalContent = 
      <div className="row text-center">
        <p>{"Are you sure you want to delete " + d.Title + "? This is forever-ever."}</p>
        <div className="row">
          <div className="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-2">
            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
          <p className="error-field">{this.state.delete_error}</p>
          <div className="col-xs-5 col-xs-offset-1 col-sm-4 col-sm-offset-2">
            <button type="button" className="btn-primary" onClick={this.deleteMeal}>Delete Meal</button>
          </div>
        </div>
      </div>;
    return (
        <Modal 
          id={"deleteMeal" + d.Id}
          title="Delete Meal?"
          body={modalContent} />
      );
  },
  renderPicPreview: function() {
    var d = this.props.data;
    var pic_src = (d.Pics.length != 0)? 
          "https://yaychakula.com/img/" + d.Pics[0].Name :
          "https://yaychakula.com/img/camera.svg",
        edit_link = "/create_meal/" + d.Id;
    return (
    <Link to={edit_link}>
      <img className="img-responsive meal-thumb" src={pic_src}/>
    </Link>);
  },
  renderMealPreview: function() {
    var d = this.props.data;
    var edit_link = "/create_meal/" + d.Id,
        title = (!d.Title)? <p>Untitled</p> : <p>{d.Title}</p>;
    return <div className="row">
          <button className="btn-delete-meal text-center" 
            data-toggle="modal" 
            data-target={"#deleteMeal" + d.Id}>
              <span className=" glyphicon glyphicon-trash delete-icon" aria-hidden="true" />
          </button>
          <div className="col-xs-3 text-center">
            {this.renderPicPreview()}
          </div>
          <div className="col-xs-8">
            <h4 className="meal-list-title">
              <Link to={edit_link}>
                {title}
              </Link>
            </h4>
            <div className="row">
              <p className="cost"><span className="glyphicon glyphicon-usd"></span>{" " + Math.round(d.Price*100)/100}</p>
              <p>{d.Description.substring(0, 100) + "..."}</p>
            </div>
          </div>
        </div>
  },
  render: function() {
    var d = this.props.data,
    errors = this.state.errors.map(function(error, i) {
          return <li key={i}>{error}</li>
        });
    return (
      <div className="meal-list-item">
        {this.renderMealPreview()}
        <ul className="error-field">
          {errors}
        </ul>
        {(d.Published)? 
          <PopupsList data={d} handleAddPopupSuccess={this.handleAddPopupSuccess}/> :
          <button className="c-blue-bg" onClick={this.publishMeal}>Publish</button>
        }
        <hr className="list-hr"/>
        {this.renderDeleteModal()}
      </div>
    );
  }
});