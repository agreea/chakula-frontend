var React = require('react'),
    MealCard = require('../meal_card.js'),
    Link = require('react-router').Link;
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
        if (Cookies.get("session"))
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
                    <div className="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                        <h2 className="text-center">Upcoming Meals</h2>
                        { s.upcomingMeals.map(function(meal) { return <MealCard data={meal} />}) }
                    </div>
                </div>);
    },
    renderHowItWorks: function() {
        return (
            <section id="about" className="how container content-section text-center">
                <h2>How it Works</h2>
                <div className="how-section row">
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-explore.png"/>
                        <h3>Find</h3>
                        <p>a meal that makes your mouth water.</p>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-reserve.png"/>
                        <h3>Reserve</h3>
                        <p>your spot at the table.</p>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-center" src="/img/chakula-break-bread.png"/>
                        <h3>Break Bread</h3>
                        <p>and enjoy great food with great company.</p>
                    </div>
                </div>
            </section>
        );
    }
    render: function() {        
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
                                {(Cookies.get("session"))?
                                    <button id='browse-meals' className="c-blue-bg cta">Browse Meals</button> :
                                    <Link to="login?signup=true">
                                        <button className="c-blue-bg cta">Sign Up</button>
                                    </Link>
                                }                 
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {this.renderHowItWorks()}
            {this.renderUpcomingMeals()}
        </div>);
    }
});