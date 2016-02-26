var React = require('react');

// props: src, style (optional), title (optional)
module.exports = React.createClass({
	getInitialState: function() {
		var id = this.hash();
		return({id: id});
	},
	componentDidUpdate: function() {
		this.loadImage();
	},
  	componentDidMount: function() {
  		this.loadImage();
  	},
  	loadImage: function() {
  		if (this.props.src.length === 0)
  			return;
    	var canvas = document.getElementById(this.state.id);
    	var context = canvas.getContext('2d');
    	var img = new Image();
    	img.onload = function() {
       	// draw cropped image
    		var width = img.width,
    			height = img.height;
       		var sourceX = 0,
       			sourceY = 0,
       			destX = 0,
       			destY = 0;
   			var destLength = width;
    		if (width > height) { // if landscape, resize by height
    			destLength = height;
    			sourceX = (width - height) / 2;
    		}
    		canvas.height = destLength,
    		canvas.width = destLength;
       		context.drawImage(img, sourceX, sourceY, destLength, destLength, destX, destY, destLength, destLength);
    	};
     	img.src = this.props.src;
  	},
  	hash: function() {
  		var randInt = Math.round(Math.random() * 100000);
  		var s = this.props.src + randInt;
	  	var hash = 0, i, chr, len;
		if (s.length === 0) return hash;
		for (i = 0, len = s.length; i < len; i++) {
			chr   = s.charCodeAt(i);
		    hash  = ((hash << 5) - hash) + chr;
		    hash |= 0; // Convert to 32bit integer
		}
		return hash;
	},
	render: function() {
		return ((this.props.src.length > 0)?
			<canvas 
				className="img-circle img-responsive img-responsive-center prof-img" 
				id={this.state.id} height="200" width="200" style={this.props.style} title={this.props.title}/> :
			<img className="img-circle img-responsive img-responsive-center prof-img"
				src="/img/user-icon.svg" style={this.props.style} title={this.props.title}/>
		);
	}
})