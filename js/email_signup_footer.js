var React = require('react'),
    Sticky = require('react-sticky');
module.exports = React.createClass({
    handleInputChange: function(e) {
        this.setState({email: e.target.value});
    },
    handleAddEmailClicked: function() {
        var email = this.state.email,
            email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (!email_regex.test(email)) {
            // this.setState({errors: ["Invalid email format. Use john@example.com."]});
            return;
        }
        var api_resp = api_call("kitchen", {
            method: "Register",
            email: email
        });
        if (api_resp.Success) {
            this.setState({success: true});
            Cookies.set('email', email);
        }
    },
    hide: function() {
        $("#subscribe-footer").hide();
        this.setState({hidden: true});
    },
    componentDidMount: function() {
        if (this.props.triggerElementId) {
            $('#subscribe-footer').hide();
            $(window).scroll(this.scrollListener);
        }
    },
    scrollListener: function(event) {
        var triggerTop = $('#' + this.props.triggerElementId).position().top;
        console.log(triggerTop)
        var scrollTop = $(window).scrollTop();
        console.log(scrollTop)
        if (scrollTop > triggerTop && !this.state.hidden)
            $('#subscribe-footer').show();            
    },
    getInitialState: function() {
       return {email: '', success: false, hidden: false}
    },
    renderSuccess: function() {
        return(
            <div>
                <h3>Thanks for signing up!</h3>
            </div>)
    },
    renderSignup: function() {
        var s = this.state;
        var paddingTop = {paddingTop: "16px"},
            textField = {color: "#434343"};
        return (
        <div>
            <div className="col-xs-12 col-md-7">
                <h4 className="white">Get Weekly Invites To Chakula Meals</h4>
                <p className="white">Never miss a chance at delicious food again</p>
            </div>
            <div className="col-xs-12 col-md-5">
               <div className="input-group" style={paddingTop}>
                    <input type="text" 
                        placeholder="Your email" 
                        value={s.email}
                        id="email"
                        className="text-field"
                        onChange={this.handleInputChange}
                        style={textField}></input>
                   <span className="input-group-btn">
                        <button className="c-blue-bg" 
                            onClick={this.handleAddEmailClicked}>Subscribe</button>
                   </span>
                </div>
            </div>
        </div>); 
    },
    render: function() {
        var s = this.state,
            stickyStyle = {  
            };
        return(
                <div className="welcome-green-bg row fixed-footer" id="subscribe-footer" style={stickyStyle}>
                    <div className="col-xs-11">
                        {(s.success)? this.renderSuccess() : this.renderSignup()}
                    </div>
                    <div className="col-xs-1 text-right">
                        <button className="transparent-bg white" onClick={this.hide}><i className="fa fa-times"></i></button>
                    </div>
                </div>);
    }
})