var React = require('react');
module.exports = React.createClass({
  render: function() {
    return(
      <div className="container-fluid">
        <div className="row" id="app-body">
          {this.props.children}
        </div>
        <div id="js-working">
        </div>
      </div>);
    }
});
