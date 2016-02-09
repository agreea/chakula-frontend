var React = require('react');
var Link = require('react-router').Link;
var MealListItem = React.createClass({
  getInitialState: function() {
      return {delete_error: ""};
  },
  deleteMeal: function() {
    var api_resp = api_call('meal', {
      method: 'deleteMeal', 
      session: Cookies.get('session'), 
      mealId: this.props.data.Id
    });
    if (!api_resp.Success){
      this.setState({delete_error: resp.Error});
      return;
    }
    this.props.handleMealDelete(this.props.key);
    $('#myModal' + this.props.key).modal('hide');
    // launch the modal
    // upon confirm, delete the meal
  },
  // renderPopups: function() { // renders a single popup screen
  //   var d = this.props.data;
  //   var starts_s = moment(d.Starts).format("dddd, MMMM Do h:mm a");
  //   return(
  //     <div className="row">
  //       <p><i className="fa fa-calendar"></i> {starts_s}</p>
  //       <p><i className="fa fa-map-marker"></i> {d.Address + ", " + d.City + ", " + d.State}</p>
  //       <p><i className="fa fa-user"></i> {d.Open_spots + " spots available"}</p>
  //     </div>
  //   );
  // },
  renderModal: function() {
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
          id={"myModal" + this.props.key}
          title="Delete Meal?"
          body={modalContent} />
      );
  },
  render: function() {
    var d = this.props.data;
    var pic_src = (d.Pics.length != 0)? 
      "https://yaychakula.com/img/" + d.Pics[0].Name :
      "https://yaychakula.com/img/camera.svg";  
    var edit_link = "/create_meal/" + d.Id;
    var title_s = d.Title;
    var title;
    var starts_s = moment(d.Starts).format("h:mm a dddd, MMMM Do YYYY");
    if (!title_s) {
      title = <p>Untitled</p>;
    } else if (moment(d.Starts) < moment()) { // show the meal is past
      title = <p>{d.Title + " [PAST]"}</p>;
    } else if (d.Published) {
      title = <p><i className="fa fa-circle live"></i>{d.Title}</p>;
    } else {
      title = <p>{d.Title}</p>
    }
    return (
      <div className="meal-list-item">
        <div className="row">
          <button className="btn-delete-meal text-center" 
            data-toggle="modal" 
            data-target={"#myModal" + this.props.key}>
              <span className=" glyphicon glyphicon-trash delete-icon" aria-hidden="true"></span>
          </button>
          <div className="col-xs-3 text-center">
            <Link to={edit_link}>
              <img className="img-responsive meal-thumb" src={pic_src}/>
            </Link>
          </div>
          <div className="col-xs-8">
            <h4 className="meal-list-title">
              <Link to={edit_link}>
                {title}
              </Link>
            </h4>
            <p><i className="fa fa-clock-o"></i>{" " + starts_s}</p>
            <div className="row">
              <p className="col-xs-3 cost"><span className="glyphicon glyphicon-usd"></span>{" " + Math.round(d.Price*100)/100}</p>
              <p className="col-xs-8"> <i className="fa fa-users"></i>{ " " + d.Capacity + " seats"}</p>
            </div>
          </div>
        </div>
        <hr className="list-hr"/>
        {this.renderPopups()}
        {this.renderModal()}
      </div>
    );
  }
});

module.exports = React.createClass({
  componentWillMount: function() {
    if (!Cookies.get('session')) {
      window.location.replace("http://yaychakula.com");
    }
    var api_resp = api_call('host', {method:'getHost', session:Cookies.get('session')});
    var alert_create_host_profile;
    if (!api_resp.Success) { // forward to create host if they don't have a host identity
      return;
    }
    var host = api_resp.Return;
    if (!host.Stripe_connect) {
      this.setState({alert_create_host_profile: "Please complete your chef profile and connect to Stripe to host meals"});
      return;
    }
    this.getMeals();
  },
  getMeals: function() {
    var api_resp = api_call('meal', {
      method: 'getMealsForHost',
      session: Cookies.get('session')
    });
    if (!api_resp.Success) {
      return;
    }
    this.setState({meals: api_resp.Return});
  },
  handleMealDelete: function(index) {
      var meals = this.state.meals;
      meals.splice(index, 1);
      this.setState({meals: meals});
  },
  render: function() {
    var handleMealDelete = this.handleMealDelete;
    var listItems = [];
    if (this.state.meals)
      listItems = this.state.meals.map(function(meal, index){
        return <MealListItem 
          data={meal}
          title={meal.Title} 
          starts={meal.Starts}
          price={meal.Price}
          seats={meal.Capacity}
          id={meal.Id}
          pic={(meal.Pics.length != 0)? meal.Pics[0].Name : ''}
          key={index}
          published={meal.Published}
          handleMealDelete={handleMealDelete} />;
    });
    var first_item = 
      (this.state.alert_create_host_profile)?
        <div className="row text-center">
          <p className="banner warning-yellow-bg">{this.state.alert_create_host_profile}</p>
        <Link to="edit_host_info">
          <button className="c-blue-bg">Complete Chef Profile</button>
        </Link> 
        </div> :
        <Link to="create_meal/">
          <img className="img-responsive img-responsive-center add-meal-icon" src="/img/add-icon.svg"/>
        </Link>
    return (
      <div className="row non-white" id="create-meal">
        <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 meal-list">
          <h2>My Meals</h2>
          <div className="text-center">
            {first_item}
          </div>
          {listItems}
        </div>
      </div>);
  }
});