module.exports = React.createClass({
	handleAddCard: function() {
        this.setState({disableAddCard: true});
    	Stripe.setPublishableKey('pk_live_N4yRGKt9KwKwi9WfpAtnPdMs');
    	console.log($('#cc-form'));
        Stripe.card.createToken($('#cc-form'), this.handleStripeResponse);
    },
    handleStripeResponse: function(status, stripe_resp) {
        if (stripe_resp.error) {
            this.setState({disableAddCard: false, error: stripe_resp.error});
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
            this.setState({addCardError: api_resp.Error, disableAddCard: false});
            return;
        }
        this.handleAddCardSuccess(stripe_resp.last4);
    },
    getInitialState: function() {
    	return ({disableAddCard: false});
    },
	render: function() {
		return (
            <div className="row">
                <form id="cc-form" className="col-sm-8">
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
                  <div className="text-center">
                      <button className="brand-btn btn btn-payment" id="add-card-btn" onclick={this.handleAddCard} disabled={this.state.disableAddCard}>Add Card</button>
                  </div>
                </form>
            </div>);
	}
});