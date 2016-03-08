var React = require('react'),
	Link = require('react-router').Link,
	FormTextRow = require('../form-row.js'),
	FormSelectRow = require('../form_select_row.js');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			Rating: 0, 
			Comment: "",
			TipPercent: 0,
			Suggestion: "",
			errors: [],
			success: false,
			notYourMeal: false,
			data: {}
		}
	},
	handleStarPressed: function(e) {
		var rating = e.target.id;
		this.setState({Rating: rating});
	},
	handleInputChanged: function(e) {
		var key = e.target.id,
			val = e.target.value,
			obj = {};
		obj[key] = val
		this.setState(obj);
	},
	attemptSubmitReview: function() {
		var s = this.state,
			errors = [];
		if(!s.Comment || s.Comment.length === 0)
			errors.push("Please describe your experience in the 'Your Review' section");
		if(s.Rating === 0)
			errors.push("Please select a 1 - 5 star rating.");
		else 
			console.log("Rating: " + s.Rating);
		this.setState({errors: errors});
		if (errors.length > 0)
			return;
		var api_data = this.state;
		api_data["method"] = "postReview",
		api_data["session"] = Cookies.get("session"),
		api_data["popupId"] = this.props.params.id;
		var api_resp = api_call("review", api_data);
		if (api_resp.Success)
			this.setState({success: true});
		else
			this.setState({errors: [api_resp.Error]});
	},
	componentWillMount: function() {
		if (!Cookies.get("session"))
			return;
		var api_resp = api_call("review", {
			method: "getReviewData",
			session: Cookies.get('session'),
			popupId: this.props.params.id,
		});
		if (api_resp.Success)
			this.setState({data: api_resp.Return});
		else
			this.setState({notYourMeal: true});
	},
	renderStars: function() {
		var stars = [],
			rating = this.state.Rating;
		for(var i = 0; i < 5; i++) {
			var color = (i > rating - 1)? "inactive-gray " : "warning-yellow ",
				star = (i > rating - 1)? "fa-star-o " : "fa-star ",
				classBase = "inline-block rating-star transparent-bg fa ";
			stars.push(<i className={classBase + star + color} id={i+1} onClick={this.handleStarPressed} />);
		}
		var ratingWords = ["", "Very unpleasant", "Below expectations", "Met expectations", "Good", "Awesome!"]
		return (
			<div className="row">
				<div className="col-xs-4 col-sm-3 col-md-2">
					<p className="text-right form-label">Rating</p>
				</div>
				<div className="col-xs-8 col-sm-9 col-md-10">
					{stars}
					<p>{ratingWords[rating]}</p>
				</div>
			</div>
		)
	},
	renderErrors: function() {
		return (<ul className="error-field">
				{this.state.errors.map(function(error, index){
					return <li key={index}>{error}</li>;
				})}
			</ul>);
	},
	renderLoginFwd: function() {
		return(
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
					<h2>Log in to Leave Your Review</h2>
					<div className="text-center">
						<Link to={"login?fwd=/review/" + this.props.params.id}>
							<button className="c-blue-bg">Login</button>
						</Link>
					</div>
				</div>
			</div>
		);
	},
	renderSubmitSuccess: function() {
		return(
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 text-center">
					<h3>Successfully submitted your review!</h3>
					<h4>{"View it on Sharon's chef profile"}</h4>
					<Link to={"/chef/" + this.state.data.Host_id}>
						<button className="c-blue-bg">{"Go to Sharon's Profile"}</button>
					</Link>
				</div>
			</div>
		);
	},
	renderNotYourMeal: function() {
		return(<h1 className="text-center">You Can Only Review Meals You Have Attended</h1>);
	},
	renderTips: function() {
		if (this.state.data.Price == 0) // don't ask for tips if they didn't pay
			return;
		return(
			<FormSelectRow
				id="TipPercent"
				label="Gratuity (%)"
				options={[0,10,15,20]}
				handleInputChanged={this.handleInputChanged}/>
		);
	},
	renderSuggestions: function() {
		var hostName = this.state.data.Host_name
		return <FormTextRow 
					id="Suggestion"
					label="Suggestions?"
					placeholder={"(Optional) Was there anything you feel " + hostName + " could improve? " + 
					"This will only be shared with " + hostName +
					" and will not show in your review on the Chakula website."}
			        textarea="true"
					onChange={this.handleInputChanged}/>
	},
	renderReviewInterface: function() {
		var d = this.state.data,
			buttonStlye={marginLeft:"15px"};
		return(
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1 col-md-10 col-md-offset-1">
					<div className="row">
						<h2 className="col-xs-offset-1 col-md-8 col-md-offset-2">{"Review " + d.Title}</h2>
					</div>
					{this.renderStars()}
			        <FormTextRow label="Description" 
						placeholder={"Please describe your experience. What did you think of the food? " +
									"What about the ambiance? Would you recommend this experience to others?"}
			          	id="Comment" 
			          	textarea="true"
			          	handleInputChanged={this.handleInputChanged} />
					{this.renderTips()}
					{this.renderSuggestions()}
					{this.renderErrors()}
					<div className="col-xs-offset-4 col-sm-offset-3 col-md-offset-2">
						<button className="c-blue-bg cta" 
							onClick={this.attemptSubmitReview} 
							style={buttonStlye}>Submit Review</button>
					</div>
				</div>
			</div>
		);
	},
	render: function(){
		if (!Cookies.get("session"))
			return this.renderLoginFwd();
		if (this.state.success)
			return this.renderSubmitSuccess();
		if (this.state.notYourMeal)
			return this.renderNotYourMeal();
		return this.renderReviewInterface();
	}
})