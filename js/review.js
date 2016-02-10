var React = require('react'),
    Link = require('react-router').Link,
    ProfImg = require('./prof_img.js');
module.exports = React.createClass({
  render: function() {
    var d = this.props.data;
    var stars = [];
    for (var i = 0; i < d.Rating; i++) {
      stars.push(<i className="fa fa-star" key={i}></i>);
    }
    return (
      <div className="review row">
        <div className="col-sm-2 text-center">
            <ProfImg src={d.Prof_pic_url}/>
            <p className="reviewer-name">
              {d.First_name}
            </p>
        </div>
        <div className="col-sm-10 review-text">
          <p className="star-rating">
            {stars}
          </p>
          <p className="comment">{d.Comment}</p>
          <div className="row">
            <div className="col-sm-8 review-meal-title">
              <p><b><Link to={"/meal/" + d.Meal_id}>
                {d.Meal_title}
              </Link></b></p>
            </div>
            <div className="col-sm-4">
              <p>
                {moment(d.Date).format("MMM Do YYYY")}
              </p>
            </div>
          </div>
          <hr className="hr-review"/>
        </div>
      </div>
    );
  }
});