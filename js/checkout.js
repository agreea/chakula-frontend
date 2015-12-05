// if there's no session, require FB login. Show nothing else
// if there IS a session, try to fetch the meal data... and it go a little something like this (cue Luda):

var TextField = React.createClass({
	editClicked: function() {
		this.setState({input_stored: false});
	},
	getInitialState: function() {
    	return {input_stored: this.props.input_stored};
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
	},
	render: function() {
		var input;
		if(this.props.input_stored) {
			input = <p>{this.props.val}<a onclick={this.editClicked}><i className="fa fa-pencil"></i></p>;
		} else {
			<input type="text" 
				id={this.props.id} 
				placeholder={this.props.placeholder} defaultValue={this.props.val} onChange={handleChange}></input>;
		}
		return (
			<div>
				<div className="col-xs-4 col-sm-2">
					<p className="label-text">{this.props.label}</p>
				</div>
				<div className="col-xs-8 col-sm-10">{input}</div>
			</div>);
	}
});

var Checkout_form = React.createClass({
	render: function() {
		return(
			{<TextField 
				val={this.props.email}
				input_stored={true} 
				placeholder={email} 
				label={'Email'}>
			</TextField>});
	}
});
// email field 

// phone field

// Payment field

// Quantity dropdown

// Subtotal field

// submit button

// Email, phone field are the same react subcomponent with the following props:
	- a regex to check the field against
	- an input value
	- a placeholder text
	- a label text
 ... and the following behavior:
 	- if input is empty, return a text field with the placeholder text
 	- if the input is not empty, return a <p> element with an edit icon next to it
 	- if user clicks the edit icon, the <p> element transforms into a text field, which the user can edit
 	- when the user leaves the input field, we check against the regex. if it doesnt match, we turn the textfield red or something indicating an error
 	- for email: user should be able to 'follow' a chef to receive updates from them
// Payment field is another react component with the following props:
	- a list of last4s for the user
	- the following behavior is expected:
 ... and the following behavior:
 	- component displays all last4s on record to the user, in a radio button interface
 	- the first item in the radio button set is selected by default
 	- last item in the radio button set is an "add card" option
 	- when the user clicks the "add card option", a form appears allowing them to enter CC info
 	- there is a submit button that the user can press. we run the data to stripe, get it back, and register the token on our end
 	- there is a disclaimer note explaining that Stripe processes the payments securely

// Quantity field is another react componenet with the following props:
	- an enumeration of the possible number of seats a user can buy

// Checkout field is simple button that submits the stuff after everything checks out:
	- are the email, phone, and card all valid?
