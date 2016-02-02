var React = require('react'),
    MealCard = require('../meal_card.js'),
    Link = require('react-router').Link,
    Review = require('../review.js');
module.exports = React.createClass({
    validateEmail: function(email) {
  // http://stackoverflow.com/a/46181/11236
        var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        return re.test(email);
    },
    subscribe: function() {
        var email = this.state.email;
        if (validateEmail(email)) {
            checkedStatus = document.getElementById("host-check").checked
            api_resp = api_call('kitchen', {
                method: "Register",
                email: email,
                host: checkedStatus
            });
            if (api_resp.Success)
                this.setState({emailSubmitSuccess: true});
        }
    },
    handleEmailChange: function(e) {
        this.setState({email: e.target.value});
    },
    componentWillMount: function() {
        var api_resp = api_call("meal", {
            method: "GetUpcomingMeals"
        });
        if (api_resp.Success)
            this.setState({upcomingMeals: api_resp.Return});
    },
    componentDidMount: function() {
        $("#browse-meals").click(function() {
            $('html,body').animate({scrollTop: $("#upcoming").offset().top},'medium');
        });
    },
    getInitialState: function() {
        return({email: '', emailSubmitSuccess: false});
    },
    renderUpcomingMeals: function() {
        var s = this.state;
        if (s.upcomingMeals && s.upcomingMeals.length > 0)
            return (
                <div className="row" id="upcoming">
                    <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <h2 className="text-center">Upcoming Meals</h2>
                        { s.upcomingMeals.map(function(meal) { return <MealCard data={meal} />}) }
                    </div>
                </div>);
    },
    renderHowItWorks: function() {
        return (
            <section className="how content-section text-center">
                <h2>How it Works</h2>
                <div className="how-section row">
                    <div className="col-xs-12 col-sm-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-explore.png"/>
                        <h3>Find</h3>
                        <p>a meal that makes your mouth water.</p>
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-reserve.png"/>
                        <h3>Reserve</h3>
                        <p>your spot at the table.</p>
                    </div>
                    <div className="col-xs-12 col-sm-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-break-bread.png"/>
                        <h3>Break Bread</h3>
                        <p>and enjoy great food with great company.</p>
                    </div>
                </div>
            </section>
        );
    },
    renderTestimonials: function() {
        var review_data = [{
    "First_name": "Livia",
    "Prof_pic_url": "https://graph.facebook.com/10153707959143024/picture?width=200&height=200",
    "Meal_id": 6,
    "Meal_title": "Sri Lankan Spicy Pumpkin Curry",
    "Rating": 5,
    "Comment": "I can't say enough good things about my first dinner with Chakula! Erin was a fantastic cook- the pumpkin curry, cucumber yogurt soup, and homemade roti were all delicious. The company and conversation were also fantastic, even though I didn't know most of the other attendees. Overall a wonderful experience and I can't wait until my next Chakula dinner!",
    "Date": "2015-10-18T00:41:17Z"
    },
    {
    "First_name": "Suzanne",
    "Prof_pic_url": "https://graph.facebook.com/10153191455001238/picture?width=200&height=200",
    "Meal_id": 4,
    "Meal_title": "Moldovan Mamaliga ca la Mamica Acasa",
    "Rating": 5,
    "Comment": "Felicia's traditional Moldovan dinner was a delicious, awesome experience! She is such a good cook and a friendly person!",
    "Date": "2015-10-06T16:05:21Z"
  },
  {
    "First_name": "Brandon",
    "Prof_pic_url": "https://graph.facebook.com/10154232450893989/picture?width=200&height=200",
    "Meal_id": 3,
    "Meal_title": "Cuban Paladar",
    "Rating": 5,
    "Comment": "Izzy's dinner perfectly combined the best aspects of both restaurant and family dining--we enjoyed delicious food prepared by a talented chef while having great conversation all gathered around one large table. Out of all the meals that I had during my four years at Georgetown, this one was truly unique. ",
    "Date": "2015-09-29T17:13:58Z"
  }];
        return (
            <section className="how container content-section">
                <h2 className="text-center">DC Loves Us</h2>
                <div className="how-section row">
                    <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2">
                        {review_data.map(function(review) { return <Review data={review}/>})}
                    </div>
                </div>
            </section>
        );
    },
    render: function() {
        var stickyStyle = 
            {  
                position: "fixed",
                bottom: "0",
                left: "0",
                right: "0",
                width: "100%"
            }   
        return(
            <div id="home">
            <header className="home-intro">
                <div className="intro-text">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-md-offset-1">
                                <h1>Come for the Food</h1>
                                <h1>Stay for the People</h1>
                                <p className="intro-text">Delectable homecooked meals with friends both old and new</p>
                                <button id='browse-meals' className="c-blue-bg cta">Browse Meals</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {this.renderHowItWorks()}
            {this.renderTestimonials()}
            {this.renderUpcomingMeals()}
        </div>);
    }
});