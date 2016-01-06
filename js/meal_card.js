var React = require('react'),
	Link = require('react-router').Link;
module.exports = React.createClass({
	render: function() {
		var d = this.props.data;
		var card_img = { 
				background: `url(${d.Pics[0].Name})`
			};
		return(
			<div className="card">
			    <Link to={`meal/${d.Id}`} target="new_blank">
			        <div className="card-image" style={card_img}>
			            <span className="card-title">{`${d.Title} - $${d.Price}`}</span>
			        </div>
			        <div className="card-action">
			        	<div className="row">
			               	<p>{moment(d.Starts, "hh:mm a MMM Do")}</p>
			            </div>
			        </div>
			    </Link>
		    </div>
		)
	}
});