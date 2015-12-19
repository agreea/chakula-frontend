var React = require('react');
var MealListItem = React.createClass({
  getInitialState: function() {
      return {delete_error: ""};
  },
  deleteMeal: function() {
    var api_resp = api_call('meal', {
      method: 'deleteMeal', 
      session: Cookies.get('session'), 
      mealId: meal_id
    });
    if (!api_resp.Success){
      this.setState({delete_error: resp.Error});
      return;
    }
    this.props.handleMealDelete(this.props.k);
    $('#myModal' + this.props.k).modal('hide');
    // launch the modal
    // upon confirm, delete the meal
  },
  render: function() {
    var pic_src = (this.props.pic)? 
      "https://yaychakula.com/img/" + this.props.pic :
      "https://yaychakula.com/img/camera.svg";  
    var edit_link = "/create_meal/" + this.props.id;
    var title_s = this.props.title;
    var title;
    var starts_s = moment(this.props.starts).format("h:mm a dddd, MMMM Do YYYY");
    if (!title_s) {
      title = <p>Untitled</p>;
    } else if (moment(this.props.starts) < moment()) { // show the meal is past
      title = <p>{this.props.title + " [PAST]"}</p>;
    } else if (this.props.published) {
      title = <p><i className="fa fa-circle live"></i>{this.props.title}</p>;
    } else {
      title = <p>{this.props.title}</p>
    }
    return (
      <div className="meal-list-item">
        <div className="row">
            <button className="btn-delete-meal text-center" 
              data-toggle="modal" 
              data-target={"#myModal" + this.props.k}>
              <span className=" glyphicon glyphicon-trash delete-icon" aria-hidden="true"></span>
            </button>
          <div className="col-sm-3 text-center">
            <Link to={edit_link}>
              <img className="img-responsive meal-thumb" src={pic_src}/>
            </Link>
          </div>
          <div className="col-sm-8">
            <h4 className="meal-list-title">
              <Link to={edit_link}>
                {title}
              </Link>
            </h4>
            <p><i className="fa fa-clock-o"></i>{" " + starts_s}</p>
            <div className="row">
              <p className="col-sm-3 cost"><span className="glyphicon glyphicon-usd"></span>{" " + this.props.price}</p>
              <p className="col-sm-8"> <i className="fa fa-users"></i>{ " " + this.props.seats + " seats"}</p>
            </div>
          </div>
        </div>
        <hr className="list-hr"/>
      <div className="modal fade" id={"myModal" + this.props.k} tabindex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title text-center" id="myModalLabel">Delete Meal?</h4>
          </div>
          <div className="error-field">
            {this.state.delete_error}
          </div>
          <div className="modal-body text-center">
            <p>{"Are you sure you want to delete " + this.props.title + "? This is forever-ever."}</p>
            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn-primary" onClick={this.deleteMeal}>Delete Meal</button>
          </div>
        </div>
      </div>
    </div>
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
    if (!host.Address || !host.Phone || !host.Email || !host.Bio || !host.Stripe_connect) {
      this.setState({alert_create_host_profile: "Please complete your host profile to host meals"});
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
    var listItems = this.state.meals.map(function(meal, index){
      return <MealListItem 
        title={meal.Title} 
        starts={meal.Starts}
        price={meal.Price}
        seats={meal.Capacity}
        id={meal.Id}
        pic={(meal.Pics.length != 0)? meal.Pics[0].Name : ''}
        k={index}
        published={meal.Published}
        handleMealDelete={this.handleMealDelete} />;
    });
    var first_item = 
      (this.state.alert_create_host_profile)?
        <a href="https://yaychakula.com/create_host.html">{this.state.alert_create_host_profile}</a> :
        <a href="https://yaychakula.com/create_meal.html">
          <img className="img-responsive img-responsive-center add-meal-icon" src="img/add-icon.svg"/>
        </a>
    // if (alert_create_host_profile) {
    //   first_item = (<a href="https://yaychakula.com/create_host.html">
    //                   {alert_create_host_profile}
    //                 </a>);
    // } else {
    //   first_item = <a href="https://yaychakula.com/create_meal.html">
    //           <img className="img-responsive img-responsive-center add-meal-icon" src="img/add-icon.svg"/>
    //         </a>
    // }
    return (
      <div className="row non-white" id="host_meal">
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