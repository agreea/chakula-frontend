var React = require('react');

// props: nodes [], maxPerRow {xs: , sm: (optional), md: (optional), lg: (optional)}
module.exports = React.createClass({
  getBootstrapClassString: function() {
    var maxPerRowKeys = Object.keys(this.props.maxPerRow),
        maxPerRow = this.props.maxPerRow;
    return maxPerRowKeys.reduce(function (previous, key){
      return "col-" + key + "-" + (12/key) + " ";
    })
  }
  render: function() {
    var rows = [], // two dimensional array. Each row contains up to maxPerRow items
        thisRow = [],
        nodes = this.props.nodes,
        bootStrapClass = this.getBootstrapClassString(),
        components = nodes.map(function(node){
          return(
            <div className={bootStrapClass}>
              {node}
            </div>)
        });                                          
    return(
      <div className="row">
        {components}
      </div>);
  },
})