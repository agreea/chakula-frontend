var React = require('react');
module.exports = React.createClass({
	// props: body (component), title (string), id (string)
	render: function() {
		return(
	      <div id={this.props.id} className="modal fade" role="dialog">
	        <div className="modal-dialog">
	          <div className="modal-content">
	            <div className="modal-header">
	              <button type="button" className="close" data-dismiss="modal">&times;</button>
	              <h4 className="modal-title text-center">{this.props.title}</h4>
	            </div>
	            <div className="modal-body row" id="modal-body">
	              <div className="row">
	              	{this.props.body}
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
		);
	}
});