var React = require('react'),
	Link = require('react-router').Link;

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
		console.log("Id: " + e.target.id);
		var rating = e.target.id
		this.setState({Rating: rating});
		console.log(this.state.Rating);
	},
	handleInputChange: function(e) {
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
		// get review data?
		// we just need the meal data
		// handle automatic login function
		if (!Cookies.get("session"))
			return;
		var api_resp = api_call("review", {
			method: "getReviewData",
			session: Cookies.get('session'),
			popupId: this.props.params.id,
		});
		if (api_resp.Success){
			this.setState({data: api_resp.Return});
		} else {
			this.setState({notYourMeal: true});
		}
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
		var ratingWord;
		switch(rating){
			case 1:
				ratingWord = "Very unpleasant";
			break;
			case 2:
				ratingWord = "Below expectations";
			break;
			case 3:
				ratingWord = "Met expectations";
			break;
			case 4:
				ratingWord = "Good";			
			break;
			case 5:
				ratingWord = "Awesome!";
			break;
		}
		return (
			<div>
				{stars}
				<p>{ratingWord}</p>
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
		return(<h1 className="text-center"> You Can Only Review Meals You Have Attended</h1>);
	},
	renderTips: function() {
		if (this.state.data.Price == 0) // don't ask for tips if they didn't pay
			return;
		return(
			<div className="row">
				<h3>Gratuity (%)</h3>
				<p>{"If you feel the experience was outstanding, please consider leaving " + this.state.data.Host_name + " gratuity."}</p>
				<select id="TipPercent" onChange={this.handleInputChange} value={this.state.TipPercent}>
					<option>0</option>
					<option>10</option>
					<option>15</option>
					<option>20</option>
				</select>
			</div>
		);
	},
	renderSuggestions: function() {
		var hostName = this.state.data.Host_name
		return(
			<div className="row">
				<h3>Suggestions</h3>
				<p className="inactive-gray">optional</p>
				<textarea id="Suggestion"
					placeholder={"Was there anything you feel " + hostName + " could improve? " + 
					"This will only be shared with " + hostName +
					" and will not show in your review on the Chakula website."}
					value={this.state.Suggestion} 
					onChange={this.handleInputChange}/>
			</div>
		);
	},
	renderReviewInterface: function() {
		var d = this.state.data;
		return(
			<div className="row">
				<div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2">
					<h2>Review</h2>
					<h1>{d.Title}</h1>
					{this.renderStars()}
					<h3>Your Review</h3>
					<textarea id="Comment" 
						placeholder={"Please describe your experience. What did you think of the food? " +
									"What about the ambiance? Would you recommend this experience to others?"}
						value={this.state.Comment} 
						onChange={this.handleInputChange}/>
					{this.renderTips()}
					{this.renderSuggestions()}
					{this.renderErrors()}
					<button className="c-blue-bg" onClick={this.attemptSubmitReview}>Submit Review</button>
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