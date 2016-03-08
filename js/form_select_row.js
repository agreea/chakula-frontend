var React = require('react');
/*
props: 
handleInputChanged: function(event), 
label: string,
id: string,
defaultValue: string (optional), 
placeholder: string (optional),
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
    if (this.props.textarea){
      return <textarea className="text-field" 
        id={this.props.id} 
        type="text" 
        defaultValue={this.props.defaultValue} 
        onChange={this.formChanged}
        placeholder={this.props.placeholder}/>
    } else {
      return <input className="text-field" 
        id={this.props.id} 
        type="text"
        defaultValue={this.props.defaultValue} 
        onChange={this.formChanged}
        placeholder={this.props.placeholder}/>
    }
  },
  render: function() {
    var options = this.props.options;
    return <div className="row form-row">
              <div className="col-xs-5 col-sm-3 col-md-2">
                <p className="form-label text-right">{this.props.label}</p>
              </div>
              <div className="col-xs-3 col-sm-2">
                <select value={this.state.value} className="border-btn" id={this.props.id} onChange={this.formChanged}>
                  {options.map(function(option, i) {
                      return <option value={option} key={i}>{option}</option>;
                    })}
                </select>
              </div>
            </div>
  }
});
