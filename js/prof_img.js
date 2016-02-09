var React = require('react');

module.exports = React.createClass({
	// 
  photoUpload: function(e){
    console.log(e);
    var files = e.target.files;
    for (var i in files) {
      console.log("i:" + i);
      console.log(files[i]);
      var file = files[i]
      if (!/image.*/.test(file.type)) {
        continue;
      }
      var reader = new FileReader();
      reader.onload = this.onload;
      reader.readAsDataURL(file);
    }
  },
  onload: function(e){
    var img = document.createElement("img");
    var pics = this.state.Pics;
    var updatePics = this.updatePics;
    img.onload = function(event) {
      var canvas = document.createElement("canvas");
      var width = img.width;
      var height = img.height;
      if (width > height) { // if landscape, resize by height
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      } else if (height > MAX_HEIGHT) { // if portrait, resize by width
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      pics.push({Name: canvas.toDataURL("image/jpeg"), Caption: ""});
      updatePics(pics);
    };
    img.src = e.target.result;
  },


	render: function() {
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');
      var imageObj = new Image();
      imageObj.onload = function() {
        // draw cropped image
	    var width = img.width;
	    var height = img.height;
	    if (width > height) { // if landscape, resize by height
	    	var destWidth = height;
	    	var destHeight = height;
	    } else if (height > MAX_HEIGHT) { // if portrait, resize by width
	    }
        var sourceX = 150;
        var sourceY = 0;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = canvas.width / 2 - destWidth / 2;
        var destY = canvas.height / 2 - destHeight / 2;
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
      };
      imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';		
		return (

		);
	}
})