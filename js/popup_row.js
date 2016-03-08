var React = require('react'),
    ProfImg = require('./prof_img.js');

module.exports = React.createClass({
  getInitialState: function() {
    return {moreClicked: false};
  },
  componentDidMount: function() {
    $('[data-toggle="tooltip"]').tooltip();
  },
  getSeatsSold: function() {
    var attendees = this.props.data.Attendees,
        seatsSold = 0;
    for (var i in attendees){
      seatsSold += attendees[i].Seats;
    }
    return seatsSold;
  },
  handleMoreClicked: function() {
    var moreClicked = this.state.moreClicked;
    this.setState({moreClicked: !moreClicked});
  },
  renderAttendee: function(attendee, index) {
    var guestText = (attendee.Seats > 1)? 
          attendee.First_name + " +" + (attendee.Seats - 1) : attendee.First_name;
    var tooltip = {
      placement: "bottom",
      text: guestText
    };
    console.log("We're here: " + attendee)
    return (
      <div className="col-xs-4 col-sm-3 col-lg-2" key={index}>
        <ProfImg 
          src={attendee.Prof_pic_url}
          tooltip={tooltip}/>
        <p className="text-center">{guestText}</p>
      </div>);
  },
  renderAttendees: function() {
    var attendees = this.props.data.Attendees;
    if (attendees === 0) return;
    return (
      <div>
        <h5>Attendees</h5>
        <div className="row">
          {attendees.map(this.renderAttendee)}
        </div>
      </div>);
  },
  renderSeatsBadge: function() {
    var d = this.props.data,
        seatsSold = this.getSeatsSold(),
        seatsBadgeText, 
        seatsBadge;
    if (seatsSold == d.Capacity)
      seatsBadgeText = "SOLD OUT!";
    else if (seatsSold == 1)
      seatsBadgeText = seatSold + " seat booked";
    else
      seatsBadgeText = seatsSold + " seats booked";
    var colorMod = (d.Capacity == seatsSold)? "hot-orange-bg" : "seapunk-bg";
    if (moment(d.Rsvp_by) < moment())
      colorMod = "inactive-gray-bg white";
    if (seatsSold > 0)
      return(
        <p className={"badge " + colorMod}>
          {seatsBadgeText}
        </p>);
  },
  renderDetails: function(){
    if (!this.state.moreClicked)
      return;
    var d = this.props.data;
    var starts = moment(d.Starts),
        rsvpBy = moment(d.Rsvp_by);
    return(
      <div>
        <p><i className="fa fa-clock-o"></i>{" Rsvp by " + rsvpBy.format("h:mm a ddd, MMM Do")}</p>
        <p><i className="fa fa-user"></i>{" " + d.Capacity + " seats"}</p>        
        {this.renderAttendees()}
        <p><i className="fa fa-map-marker"></i> {" " + d.Address + ", " + d.City + ", " + d.State}</p>
      </div>);
  },
  renderLiveDot: function() {
    var rsvpBy = moment(this.props.data.Rsvp_by);
    return (rsvpBy > moment())? 
      <i className="fa fa-circle live-dot active-green"
        data-toggle="tooltip" 
        data-placement="top" 
        title="Reservations are open"/> :
      <i className="fa fa-circle live-dot inactive-gray"
        data-toggle="tooltip" 
        data-placement="top" 
        title="Reservations are closed"/>;
  },
  render: function() {
    var starts = moment(this.props.data.Starts)
    return(
      <div className="row">
        <p className="inline-block">
          {this.renderLiveDot()}
          {" " + starts.format("h:mm a ddd, MMM Do")}
        </p>
        {this.renderSeatsBadge()}
        <button className="transparent-bg inline-block" onClick={this.handleMoreClicked}>
          <i className={(this.state.moreClicked)? "fa fa-chevron-up" :  "fa fa-chevron-down"} />
        </button>
        {this.renderDetails()}
      </div>
    );
  }
});