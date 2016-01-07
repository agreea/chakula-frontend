var React = require('react');
module.exports = React.createClass({
  getInitialState: function() {
      return ({value: this.props.default_value});
  },
  formChanged: function(e) {
    this.setState({value: e.target.value});
    this.props.handleInputChanged(e);
  },
  render: function() {
    return (<div className="row">
        <div className="col-xs-4 col-sm-3">
          <p className="text-right form-label">{this.props.form_name}</p>
        </div>
        <div className="col-xs-8 col-md-5">
        <input className="text-field" id={this.props.id} type="text" 
          defaultValue={this.props.default_value} 
          onChange={this.formChanged}
          placeholder={this.props.placeholder}/>
        </div>
      </div>);
  }
});
