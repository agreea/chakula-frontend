var React = require('react');
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
            if (api_resp.Success) {
                this.setState({emailSubmitSuccess: true});
            }
        }
    },
    handleEmailChange: function(e) {
        this.setState({email: e.target.value});
    },
    getInitialState: function() {
        return({email: '', emailSubmitSuccess: false});
    },
    render: function() {        
        var email_message = "Get invites to unforgettable popup meals hosted by the best chefs in DC.";
        if (this.state.emailSubmitSuccess) {
            email_message = "Thanks for signing up! We'll be in touch soon";
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
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center">
                                <p className="intro-text">{email_message}</p>
                                <form className="text-center" id="signup" role="form">
                                    <div className="input-group">
                                        <input className="email-field btn-lg" 
                                            name="email" 
                                            id="email" 
                                            type="email" 
                                            placeholder="Your email" 
                                            value={this.state.email} onChange={this.handleEmailChange} required></input>
                                        <button className="submit-btn btn-info btn-lg" type="button" onClick={this.validate}>Signup</button>
                                        <div className="checkbox">
                                            <label><input type="checkbox" id="host-check">I can cook and wanna get paid to host!</input></label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <section id="about" className="how container content-section text-center">
                <h2>How it Works</h2>
                <div className="how-section row">
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-centered" src="/img/chakula-explore.png"/>
                        <h3>Find</h3>
                        <p>a meal that makes your mouth water.</p>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-centered" src="/img/chakula-reserve.png"/>
                        <h3>Reserve</h3>
                        <p>your spot at the table.</p>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <img className="img-responsive img-responsive-centered" src="/img/chakula-break-bread.png"/>
                        <h3>Break Bread</h3>
                        <p>and enjoy great food with great company.</p>
                    </div>
                </div>
            </section>
            <section className="row">
            </section>
        </div>);
    }
});

//                 <UpcomingMeals/>
