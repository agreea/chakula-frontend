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
                <div className="intro-body">
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
                <div className="how-section row">
                    <div className="col-lg-8 col-lg-offset-2">
                        <h2>How it Works</h2>
                        <p>Chakula connects the best cooks in DC with guests who are hungry for a new way to dine. Hosts make money doing what they love and guests get an unforgetable meal.</p>
                        <ol>
                            <li><b> Discover upcoming meals </b> prepared by our incredible hosts in our weekly email.</li>
                            <li><b> See something you like? </b> Request a spot at the table.</li>
                            <li>Once the host welcomes you to their meal, we send you their address. <b> Bon appetit!</b></li>
                        </ol>
                    </div>
                </div>
            </section>
            <section className="row">
            </section>
        </div>);
    }
});

//                 <UpcomingMeals/>
