var React = require('react'),
    Link = require('react-router').Link,
    MealListItem = require('../meal_list_item.js');
module.exports = React.createClass({
  componentWillMount: function() {
    if (!Cookies.get('session')) // TODO: login screen
      window.location.replace("http://yaychakula.com");
    var api_resp = api_call('host', {method:'getHost', session:Cookies.get('session')});
    if (!api_resp.Success) // forward to create host if they don't have a host identity
      return;
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
    if (!api_resp.Success)
      return;
    this.setState({meals: api_resp.Return});
  },
  handleMealDelete: function(mealId) {
    var meals = this.state.meals;
    for (var i in meals) {
      if (meals[i].Id == mealId) {
        meals.splice(i, 1);
        this.setState({meals: meals});
        return;
      }
    }
  },
  render: function() {
    var handleMealDelete = this.handleMealDelete;
    var listItems = [];
    if (this.state.meals)
      listItems = this.state.meals.map(function(meal, index){
        return <MealListItem 
          data={meal}
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