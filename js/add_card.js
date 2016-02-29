var React = require('react');
// props: handleAddCardSuccess: function(last4)
module.exports = React.createClass({
	handleAddCard: function() {
        this.setState({disableAddCard: true});
        var stripe_key = 
            (window.location.href.startsWith("https://yaychakula"))?
                'pk_live_N4yRGKt9KwKwi9WfpAtnPdMs' : 'pk_test_BIZGDe0MftvY6O5JiSj2rBJ8';
    	Stripe.setPublishableKey(stripe_key);
    	console.log($('#cc-form'));
        Stripe.card.createToken($('#cc-form'), this.handleStripeResponse);
    },
    handleStripeResponse: function(status, stripe_resp) {
        if (stripe_resp.error) {
            console.log(stripe_resp.error);
            this.setState({disableAddCard: false, err: stripe_resp.error.message});
            return;
        }
        console.log(stripe_resp);
        this.submitTokenToServer(stripe_resp);
    },
    submitTokenToServer: function(stripe_resp) {
        var api_resp = 
            api_call("kitchenuser", {
                method: "AddStripe",
                session: Cookies.get("session"),
                stripeToken: stripe_resp.id,
                last4: stripe_resp.card.last4});
        if (!api_resp.Success) {
            this.setState({
                addCardError: api_resp.Error, 
                disableAddCard: false,
                err: "Failed to add card. Check your credentials and try again"
            });
            return;
        }
        this.props.handleAddCardSuccess(stripe_resp.card.last4);
    },
    getInitialState: function() {
    	return ({disableAddCard: false, err: ""});
    },
	render: function() {
		return (
            <div className="row">
                <form id="cc-form">
                    <span className="error-field" id="payment-errors"></span>
                    <div className="form-row">
                      <label>
                         <input type="text" size="20" data-stripe="number" placeholder="Card #"/>
                      </label>
                    </div>
                    <div className="form-row">
                        <label>
                            <input type="text" size="4" data-stripe="exp-month" placeholder="MM"/>
                        </label>
                        <span> / </span>
                        <label>
                            <input type="text" size="4" data-stripe="exp-year" placeholder="YY"/>
                        </label>
                        <span>  </span>
                        <label>
                             <input type="text" size="4" data-stripe="cvc" placeholder="CVC"/>
                          </label>
                    </div>
                </form>
                <p className="error-field">{this.state.err}</p>
                <div className="text-center">
                    <button className="brand-btn btn btn-payment" id="add-card-btn" onClick={this.handleAddCard} disabled={this.state.disableAddCard}>Add Card</button>
                </div>
            </div>);
	}
});