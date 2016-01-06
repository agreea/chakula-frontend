var React = require("react"),
	MealCard = require("../meal_card.js");
var ChefProfile = React.createClass({
	handleFollowClicked: function() {
		if (Cookies.get("session")) {
			// forward to login screen, redirect here maybe with a follow action
			return;
		}
		var follows = this.state.follows;
		var api_resp = api_call("host", {
			method: (follows)? "Unfollow" : "Follow",
			session: Cookies.Get("session"),
			hostId: this.location.params.Id
		});
		if (api_resp.Success)
			this.setState({Follows: !follows});
	},
	componentWillMount: function() {
		var api_resp = api_call("host", {
			method: "GetProfile",
			session: Cookies.get("session"),
			hostId: this.props.location
		});
		if (api_resp.Success){
			this.setState(api_resp.Return)
		}
	},
	renderMeals: function() { // returns 
		var s = this.state,
			upcomingMeals = [],
			pastMeals = [];
		if (s.Meals && s.Meals.length > 0) {
			for(var i in s.Meals) {
				var meal = s.Meals[i];
				var mealCard = <MealCard data={meal} />;
				if (moment(meal.Rsvp_by) > moment())
					upcomingMeals.push(mealCard);
				else
					pasMeals.push(mealCard);
			}
		}
		var upcomingMealsComponent = (upcomingMeals.length > 0)?
			<div>
				<h3>Upcoming Meals</h3>
				{upcomingMeals}
			</div> : "";
		var pastMealsComponent = (pastMeals.length > 0)?
			<div>
				<h3>Upcoming Meals</h3>
				{upcomingMeals}
			</div> : "";
		return (
			<div>
				{upcomingMealsComponent}
				{pastMealsComponent}
			</div>);
	},
	render: function(){ 
		// if there is something loaded:
		var s = this.state;
		if (!s.Name)
			return (<h3>Error loading host profile!</h3>);
		var cover_style = 
			{
				minHeight: "300px",
				width: "100%",
/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#40deef+0,35ea7e+99 */
				background: "rgb(64,222,239)", /* Old browsers */
				background: "-moz-linear-gradient(-45deg, rgba(64,222,239,1) 0%, rgba(53,234,126,1) 99%)", /* FF3.6-15 */
				background: "-webkit-linear-gradient(-45deg, rgba(64,222,239,1) 0%,rgba(53,234,126,1) 99%)", /* Chrome10-25,Safari5.1-6 */
				background: "linear-gradient(135deg, rgba(64,222,239,1) 0%,rgba(53,234,126,1) 99%)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
				filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#40deef', endColorstr='#35ea7e',GradientType=1 )", /* IE6-9 fallback on horizontal gradient */
			},
			parent_style = {
				position: "relative"
			},
			chef_pic_style =
			{
				paddingLeft: "75px",
				marginTop: "-90px"				
			},
			cps ={ maxHeight: "180px"};
		mealsComponent = this.renderMeals();
		return( 
		<div id="chef-profile" className="container-fluid" >
			<div className="row">
				<div className="cover-img" style={cover_style}>
				</div>
			</div>
			<div className="row" parent_style={parent_style}>
				<div className="col-xs-12 col-sm-4 col-md-3 text-center" style={chef_pic_style}>
					<img className="chef-pic img-responsive img-circle img-responsive-center"
						src={s.Prof_pic}
						style={cps}/>
					<button className="c-blue-bg" onClick={this.handleFollowClicked}>{(s.Follows)? "Following" : "Follow"}</button>
				</div>
				<div className="col-xs-12 col-sm-6 col-md-7">
					<h1>{s.Name}</h1>
					<p>`${s.City}, ${s.State}`</p>
					<hr />
					<p>{s.Bio}</p>
					<hr />
					<h2>Past Meals</h2>
					<div className="col-sm-12">
						{mealsComponent}
					</div>
				</div>
			</div>
		</div>);
	},
});
React.render(<ChefProfile />, document.getElementById('chef'));