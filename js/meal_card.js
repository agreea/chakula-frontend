var React = require('react'),
	Link = require('react-router').Link;
// takes a meal object in its data prop as received from the server
// takes returned objects from API methods:
// getMeal
// getUpcoming meal
module.exports = React.createClass({
	render: function() {
		var d = this.props.data;
		var card_img = { 
				background: `url(${d.Pics[0].Name})`,
				backgroundPosition: "center center",
    			backgroundRepeat: "no-repeat",
    			backgroundSize: "cover"
			};
		return(
			<div className="card">
			    <Link to={`meal/${d.Id}`} target="new_blank">
			        <div className="card-image" style={card_img}>
			            <span className="card-title">{`${d.Title} - $${d.Price}`}</span>
			        </div>
			        <div className="card-action">
			        	<div className="row">
			               	<p>{moment(d.Starts).format("hh:mm a MMM Do")}</p>
			            </div>
			        </div>
			    </Link>
		    </div>
		)
	}
});