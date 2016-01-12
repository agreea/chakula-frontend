var React = require('react'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function() {
		return(
		<div id="why-chakula">
			<header className="intro-text">
		      <div className="row text-center" id="header">
		        <h1 >Why Chakula?</h1>
		        <p>We make it easier for you to focus on the cooking.</p>
		        <p id="down-btn" ><a href="#body"><i className="fa fa-chevron-down" id="down-icon"></i></a></p>
		      </div>
		  </header>
		  <div className="row body" id="body">
		    <div className="col-sm-10 col-sm-offset-1 text-center">
		      <div className="row body-section">
		        <div className="col-sm-4">
		            <img className="img-responsive img-responsive-center icon" src="img/audience-icon.svg"/>
		            <h3>Targeted Audience</h3>
		            <p>Reach nearby customers looking for home cooked meals and classes.</p>
		        </div>
		        <div className="col-sm-4 text-center">
		            <img className="img-responsive img-responsive-center icon" src="img/online-icon.svg"/>
		            <h3>Easy Web Presence</h3>
		            <p>Create sleek, professional, pages for your events in seconds. We make sure everything looks great and works the way it should.</p>
		        </div>
		        <div className="col-sm-4 text-center">
		            <img className="img-responsive img-responsive-center icon" src="img/payments-icon.svg"/>
		            <h3>No-stress Payments</h3>
		            <p>We handle all of the payment logistics on your behalf using Stripe, our payments processor.</p>
		        </div>
		      </div>
		      <div className="row body-section">
		        <h3>Requirements</h3>
		        <ul>
		            <li>Must be qualified to work in the US</li>
		            <li>Must submit a 1099 before first event</li>
		            <li>Must pass a kitchen inspection conducted by Chakula</li>
		            <li>Must also pass a taste teste</li>
		        </ul>
		      </div>
		      <div className="row body-section">
		        <h3>The Chakula Process</h3>
		        <ol className="text-left">
		            <li>Chefs create event listings by pressing the "Host" tab in the navigation bar above.</li>
		            <li>Chefs add info to their listing, including pictures, a start time, an RSVP deadline, a menu, and price.</li>
		            <li>The event will show up on the Chakula homepage as well as in the Chakula weekly emails.</li>
		            <li>Guests can request to join the event. Chakula takes their payment information, and once you accept them to the event, we give them your address.</li>
		            <li>The event happens and everyone has a great time!</li>
		            <li>Guests are encouraged to leave chefs a review in order to build their reputation.</li>
		            <li>Chakula processes payments 6 days after the event, allowing time to handle any possible refunds.</li>
		        </ol>
		      </div>
		      <div className="row body-section text-center">
		      	<Link to={(Cookies.get("session"))? "/edit_host_info" : "/login?fwd=edit_host_info"}>
			      	<button>Apply Now</button>
			    </Link>
		      </div>
		    </div>
		  </div>
		</div>);
	}
});