var attendees_data = meal_data.Attendees;
var AttendeeList = React.createClass({
  render: function() {
    if (this.props.data.length === 0) {
      return(
        <div className='col-xs-6 col-sm-4 col-md-3'>
          <p> Be the first! </p>
        </div>
      );
    } else {
      return (<Attendees data={this.props.data}/>);
    }
  }
});

var Attendees = React.createClass({
  render: function() {
    attendeeData = this.props.data
    // get all of the attendees, including guests into an array
    all_attendees = attendeeData.map(function (attendee) {
      attendee = {name: attendee.First_name, 
                    pic: attendee.Prof_pic_url};
      all_attendees.push(attendee);
      if (attendee.Seats > 1) {
        attendee_guest = {name: attendee.First_name + "'s Guest",
                           pic: attendee.Prof_pic_url};
        all_attendees.push(attendee_guest);
      }
    });
    // create components for each one
    var attendee_profiles = all_attendees.map(function (attendee) {
      return (
        <div className="col-xs-6 col-sm-4 col-md-3">
          <img className="img-responsive img-circle" src={attendee.pic}/>
          <p>{attendee.name}</p>
        </div>
      );
    });
    return (
      <div className="attendees">
        <h3 className="text-center">Attendees</h3>
        <div className="attendees-list">
          {attendee_profiles}
        </div>
      </div>
    );
  }
});

React.render(
  <AttendeeList data={attendees_data}/>,
  document.getElementById('attendees')
);
