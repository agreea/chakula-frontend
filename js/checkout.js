var LoginSignUpModal = require('./login.js');
var AddCardForm = require('./add_card.js');

var TextField = React.createClass({
    editClicked: function() {
        this.setState({input_stored: false});
        console.log("input stored??");
    },
    getInitialState: function() {
        return {input_stored: this.props.input_stored};
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function() {
        var input;
        if(this.state.input_stored) {
            input = <p>
                {this.props.val} <a onClick={this.editClicked}>
                    <i className="fa fa-pencil"></i>
                </a></p>;
        } else {
            input = <input type="text" 
                id={this.props.id} 
                placeholder={this.props.placeholder} 
                defaultValue={this.props.val}
                onChange={this.handleChange}></input>;
        }
        return (
            <div className="row">
                <div className="col-xs-3 col-sm-2 label-text text-right">
                    <p>{this.props.label}</p>
                </div>
                <div className="col-xs-8 col-sm-4">{input}</div>
            </div>);
    }
});

var PaymentField = React.createClass({
    handlePaymentPress: function() {
        this.setState({paymentPressed: true});
    },
    radioChanged: function(e) {
        this.props.handleSelectedCardChange(e.currentTarget.id);
        this.setState(
            {showAddCardForm: e.currentTarget.id === "add-card", 
            selected: e.currentTarget.id, 
            addCardError: ''});
    },
    handleAddCardSuccess: function(last4) {
        this.props.cards.push(last4);
        this.props.handleSelectedCardChange(last4);
        this.setState({showAddCardForm: false, selected: last4});
    },
    cardsList: function () {
        var radioChanged = this.radioChanged;
        var selected_card = this.state.selected;
        var cards = this.props.cards.map(function(card, index) {
            return <p><input type="radio" 
                name="card" 
                onChange={radioChanged}
                checked={card == selected_card}
                id={card}>{" **** - **** - **** - " + card}</input></p>
        });
        var add_card; // add-card radio option. shows input form if it's selected
        if (this.state.showAddCardForm) {
            add_card = 
                <div>
                    <p>
                        <input className="row" 
                            type="radio" 
                            onClick={radioChanged} 
                            id="add-card"
                            checked={true}> Add Card</input>
                    </p>
                    <AddCardForm handleAddCardSuccess={this.handleAddCardSuccess}></AddCardForm>
                </div>;
        } else {
            add_card = 
                <p>
                    <input type="radio" 
                        name="card" 
                        onChange={radioChanged} 
                        id="add-card"> Add Card</input>
                </p>;
        }
        cards.push(add_card);
        return <form className="col-xs-7 col-sm-5" id="cards">{cards}</form>;
    },
    getInitialState: function() {
        return(
            {showAddCardForm: false, 
            paymentPressed: false, 
            selected: this.props.cards[0]});
    },
    render: function() {
        var paymentField;
        if (!this.state.paymentPressed && this.props.cards.length > 0) {
            paymentField = 
                <div className="col-xs-8 col-sm-6 col-md-5">
                    <p>
                        <button className="payment-button"
                            onClick={this.handlePaymentPress}>
                            <i className="fa fa-credit-card"></i> {this.props.cards[0]}</button>
                    </p>
                </div>;
        } else {
            paymentField = this.cardsList();
        }
        return(  
            <div className="row">
                <div className="col-xs-3 col-sm-2 label-text text-right">
                    <p>Payment</p>
                </div>
                {paymentField}
            </div>);
    }
});
var SeatsSelect = React.createClass({
    handleSelectChange: function(e){
        this.props.handleSeatChange(e.target.value);
        this.setState({seats: e.target.value});
    },
    getInitialState: function(){
        return({seats: this.props.seats});
    },
    render: function(){
        var options = [];
        for(var i = 1; i < this.props.open_spots; i++) {
            options.push(<option value={i}>{i}</option>);
        }
        return (<div className="row">
            <div className="col-xs-3 col-sm-2 label-text text-right">
                <p className="label-text">Seats</p>
            </div>
            <div className="col-xs-8 col-sm-6 col-md-5">
                <select onChange={this.handleSelectChange} value={this.state.seats}>
                    {options}
                </select>
            </div>
        </div>)
    }
});
module.exports = React.createClass({
    // used by child PaymentField to update parent about which card to use for booking.
    handleSelectedCardChange: function(selectedCard) {
        this.setState({selectedCard: selectedCard});
    },
    handleSeatChange: function(new_seats) {
        this.setState({seats: new_seats});
    },
    handleBookPressed: function() {
        var selectedCard = this.state.selectedCard;
        if (!selectedCard || !/^\d{4}$/.test(selectedCard)) { 
            this.setState({error: 'Select a valid card.'})
            console.log('Card was invalid: ' + selectedCard);
            return;
        }
        api_resp = api_call('mealrequest', {
            method: 'sendRequest', 
            mealId: getUrlVars()['Id'],
            session: Cookies.get('session'), 
            last4: selectedCard,
            seats: this.state.seats
        });
        if (api_resp.Success) {
            // idk close the modal? Show a success screen?
            this.setState({booked_success: true});
        } else {
            // show errors?
            this.setState({error: api_resp.Error});
        }
    },
    handleLoginSuccess: function(){ this.props.handleLoginSuccess() },
    getInitialState: function() {
        return({
            error: '', 
            selectedCard: ((this.props.cards)? this.props.cards[0] : ''), 
            seats: 1
        });
    },
    render: function() {
        console.log(this.state);
        if (this.state.booked_success) {
            return (
                <div className="text-center">
                    <h2 className="text-center">Meal successfully booked!</h2>
                </div>
            );
        }
        if (!Cookies.get('session')) {
            return (
                <LoginSignUpModal handleLoginSuccess={this.handleLoginSuccess}/>
            );
        }
        return(
            <div className="text-left row">
                <SeatsSelect handleSeatChange={this.handleSeatChange} seats={this.state.seats} open_spots={this.props.open_spots}/>
                <PaymentField cards={this.props.cards} handleSelectedCardChange={this.handleSelectedCardChange}></PaymentField>
                <div className="row error-field">
                    <div className="col-xs-9 col-xs-offset-3 col-sm-8 col-sm-offset-2">
                        <p>{this.state.error}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-8 col-xs-offset-3 col-sm-6 col-sm-offset-2">
                        <button className="brand-btn" 
                            disabled={this.props.cards.length === 0} 
                            onClick={this.handleBookPressed}>Book</button>
                    </div>
                </div>
            </div>);
    }
});
// check for session: if none ==> show facebook and return
// get checkout for meal id: {following, credit_cards, hasEmail, hasPhone}
/*
*/
// var handleLoginSuccess = function() {
//     // TODO: define a checkout function
    
//         var api_resp = api_call('meal', {method:'checkout', mealId: mealId, session: Cookies.get('session')});
//         if (api_resp.Success) {
//             React.render(<CheckoutForm 
//                 cards={[api_resp.Return.Cards] 
//                 following={api_resp.Return.Following}}/>, 
//             document.getElementById('checkout'));
//         } else {
//             // show error field that you couldn't load checkout.
//         }
    
//     React.render(<CheckoutForm cards={[1234,2345,3456,4567]}/>, document.getElementById('checkout'));
// }
// render();
