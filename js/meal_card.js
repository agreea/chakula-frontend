var React = require('react'),
	Link = require('react-router').Link;
// takes a meal object in its data prop as received from the server
// takes returned objects from API methods:
// getMeal
// getUpcoming meal
module.exports = React.createClass({
	render: function() {
		var d = this.props.data;
		console.log(d);
		var card_img = { 
				background: `url(/img/${d.Pics[0].Name})`,
				backgroundPosition: "center center",
    			backgroundRepeat: "no-repeat",
    			backgroundSize: "cover"
			};
		var price = Math.round(d.Price*100)/100;
		var alert;
		switch(d.Open_spots){
			case 0:
				alert = <span className="meal-card-alert text-right">Sold out</span>;
			break;
			case 1:
				alert = <span className="meal-card-alert text-right">1 Seat Left</span>;
			break;
			case 2: 
				alert = <span className="meal-card-alert text-right">2 Seats Left</span>;
			break;
			case 3:
				alert = <span className="meal-card-alert text-right">3 Seats Left</span>;
			break;
			default:
				"";
			break;
		}
		return(
			<div className="card">
			    <Link to={`meal/${d.Id}`} target="new_blank">
			        <div className="card-image" style={card_img}>
			        	{soldOut}
			            <span className="card-title">{`${d.Title} - $${price}`}</span>
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