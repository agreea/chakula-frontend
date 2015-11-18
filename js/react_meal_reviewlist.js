var reviewData = meal_data.Host_reviews;
var ReviewBox = React.createClass({
  render: function() {
    return (
      <div className="reviewBox">
        <h3 className="text-center">Reviews</h3>
        <ReviewList data={this.props.data}/>
        <ReviewForm />
      </div>
    );
  }
});

var Review = React.createClass({
  render: function() {
    var stars = [];
    for (var i = 0; i < this.props.rating; i++) {
      stars.push(<span className="glyphicon glyphicon-star"/>);
    }
    return (
      <div className="review row">
        <div className="col-sm-2 text-center">
            <img className="img-circle guest-pic img-responsive" src={this.props.pic_url}/>
            <p className="reviewer-name">
              {this.props.first_name}
            </p>
        </div>
        <div className="col-sm-10 review-text">
          <p className="star-rating">
            {stars}
          </p>
          {this.props.children}
          <div className="row">
            <div className="col-sm-6">
              <a href={"https://yaychakula.com/meal.html?Id=" + this.props.meal_id}>
                {this.props.title}
              </a>
            </div>
            <div className="col-sm-6">
              <p>
                {this.props.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var ReviewList = React.createClass({
  render: function() {
    if (!this.props.data){
      return (
        <div className="reviewList">
          <p>No reviews yet!</p>
        </div>
      );
    }
    var reviewNodes = this.props.data.map(function (review) {
      var date_ts = Date.parse(review.Date);
      var date = new Date(date_ts);
      console.log(review);
      return (
        <Review first_name={review.First_name} 
                date={getShortMonth(date.getMonth()+1) + ' ' +
                      date.getDate() + ', ' + 
                      date.getFullYear()} 
                pic_url={review.Prof_pic_url}
                rating={review.Rating}
                title={review.Meal_title}
                meal_id={review.Meal_id}>
          {review.Comment}
        </Review>
      );
    });
    return (
      <div className="reviewList">
        {reviewNodes}
      </div>
    );
  }
});

var ReviewForm = React.createClass({
  render: function() {
    return (
      <div className="reviewForm">
      </div>
    );
  }
});
React.render(
  <ReviewBox data={reviewData}/>,
  document.getElementById('reviews')
);
