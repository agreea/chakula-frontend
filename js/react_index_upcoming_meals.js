var api_resp = api_call("meal", {
  method: "getUpcomingMeals",
});
if (api_resp.Success) {
  // populate that shit
  var Meal = React.createClass({
    render: function() {
       return (
        <div className="col-sm-6 col-xs-12">
          <div className="card">
               <a href={"http://yaychakula.com/meal.html?Id=" + 
                this.props.Id} target="new_blank">
              <div className="card-image">
                  <img className="img-responsive" src={'img/' + this.props.Pic}/>
                  <span className="card-title">
                      {this.props.Title + ' - $' + Math.round(this.props.Price*100)/100}
                  </span>
              </div>
              <div className="card-action">
                  <a href={"http://yaychakula.com/meal.html?Id=" + 
                    this.props.Id} target="new_blank">{moment(this.props.starts).format("h:mm a dddd, MMMM Do YYYY")}</a>
                  <a href={"http://yaychakula.com/meal.html?Id=" + 
                    this.props.Id} target="new_blank">{this.props.Open_spots + 
                    ' Seats Available'}</a>
              </div>
              </a>
          </div>
        </div>            
       ); 
    }
    });

   
  var Meals = React.createClass({
    render: function() {
      var mealNodes = this.props.data.map(function (meal) {
        return (
          <Meal Id={meal.Id} 
            Pic={meal.Pics[0].Name} 
            Price={meal.Price} 
            Title={meal.Title} 
            Open_spots={meal.Open_spots}
            Starts={meal.Starts} />
        );
      });
      return (
        <div className="Meals">
          {mealNodes}
        </div>
      );
    }
  });
  React.render(
    <Meals data={api_resp.Return}/>,
      document.getElementById('meals')
    );
}
