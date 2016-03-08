var React = require('react');
/*
props: 
handleInputChanged: function(event), 
label: string,
id: string,
defaultValue: string (optional), 
placeholder: string (optional),
textarea: bool (optional)
*/ 
module.exports = React.createClass({
  getInitialState: function() {
      return ({value: this.props.defaultValue});
  },
  formChanged: function(e) {
    this.setState({value: e.target.value});
    this.props.handleInputChanged(e);
  },
  renderInput: function() {
    return (this.props.textarea)?
      <textarea className="text-field" 
        id={this.props.id} 
        type="text" 
        defaultValue={this.props.defaultValue}
        value={this.state.value}
        onChange={this.formChanged}
        placeholder={this.props.placeholder}
        rows="8"/> :
      <input className="text-field" 
        id={this.props.id} 
        type="text"
        defaultValue={this.props.defaultValue} 
        value={this.state.value}
        onChange={this.formChanged}
        placeholder={this.props.placeholder}/>
  },
  render: function() {
    return (<div className="row">
        <div className="col-xs-4 col-sm-3 col-md-2">
          <p className="text-right form-label">{this.props.label}</p>
        </div>
        <div className="col-xs-8">
          {this.renderInput()}
        </div>
      </div>);
  }
});
