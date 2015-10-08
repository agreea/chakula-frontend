// Documentation for the datepicker: http://xdsoft.net/jqplugins/datetimepicker/

var pic_preview_urls = [];
var formData = new FormData();
var xhr = new XMLHttpRequest();
xhr.open('POST', 'api/meal', true);
var price = 0;
ar seats = 2;
var title = '';
var description = '';
var starts = 0;
var rsvpBy = 0;
Date.parseDate = function(input, format){
  return moment(input,format).toDate();
};

Date.prototype.dateFormat = function(format){
  return moment(this).format(format);
};

 $(document).ready(function(){
  $('#nav').load('include/nav_bar.html');
  $('#guests-pay').text('Guests will pay: $' + price * 1.28);
  $('#payout-val').text('$' + price * seats);
  initDatepickers();
  setListeners();
  var session = Cookies.get('session');
    if (session === undefined || session === "") {
    // $('.meal-data').hide();
    } else {
      $('#fb').hide();
      api_resp = getHostData();
      if (api_resp.Success) {
        console.log("success");
        // // populate the host data fields
        // setupHostData(api_resp.Return);
      } else {
        console.log("failure");
        // show an error message or fb login
      }
    }
  });

function setGuests(count) {
  seats = count;
  $('#seats').html(count + ' <span class="caret"></span>');
  $('#payout-val').text('$' + seats * price);
}

xhr.onload = function () {
      if (xhr.status === 200) {
        // File(s) uploaded.
      } else {
        alert('An error occurred!');
      }
};

var Pic = React.createClass({
  render: function() {
    return (
        <img className="img-responsive pic" src={this.props.pic_url}/>
    );
    }
  });

var PicList = React.createClass({
  render: function() {
    var picNodes = this.props.data.map(function (picUrl) {
      return (
        <div className="col-sm-4 pic-card">
          <Pic pic_url={picUrl}></Pic>
          <input className="form-control" type="text" placeholder="Caption?"></input>
        </div>
      );
    });
    return (
      <div className="picList row">
        {picNodes}
      </div>
    );
  }
});

function render(pic_preview_urls) {
    React.render(
      <PicList data={pic_preview_urls} />,
      document.getElementById('pic-grid'));
}

function readURL(input) {
      var files = input.files;
      for (var i in files) {
        var file = files[i]
        if (!file.type.match('image.*')) {
          continue;
        }
        formData.append('photos[]', file, file.name);
        var reader = new FileReader();
        reader.onload = function (e) {
          pic_preview_urls.push(e.target.result);
          render(pic_preview_urls);
        }
        reader.readAsDataURL(file);
      }
}

function setListeners() {
  $('#price').change(function(){
    price = $(this).val();
    console.log(price);
    $('#payout-val').text('$' + price * seats);
    $('#guests-pay').text('Guests will pay: $' + price * 1.28);
  });
  $("#img-upload").change(function(){
    console.log("How about now?");
    readURL(this);
  });

  $('#save').click(function(){
    formData.append('method', 'saveDraft');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('starts', starts);
    formData.append('rsvpBy',rsvpBy);
    formData.append('price', price);
    formData.append('seats', seats);
    console.log('starts: ' + starts);
    console.log('rsvpBy: ' + rsvpBy);
    console.log('seats: ' + seats);
    console.log('price: ' + price);
    console.log('title: ' + title);
    console.log('description: ' + description);

    console.log(formData);
    xhr.send(formData);
    // do something
    // do something else
    // do another fucking thing
  });
  $('#title').change(function(){
    title = $(this).val();
  });
  $('#description').change(function(){
    description = $(this).val();  });
}

function initDatepickers() {
  $('#rsvp-by-time').datetimepicker({
    format:'MM.DD.YYYY h:mm a',
    formatTime:'h:mm a',
    formatDate:'DD.MM.YYYY',
    inline:false,
    lang:'en',
    onChangeDateTime:function(dp,$input){
      var date_time = Date.parseDate($input.val(), 'MM.DD.YYYY h:mm a');
      starts = date_time.getTime();
      console.log(starts);
    }
  });
  $('#starts-time').datetimepicker({
    format:'MM.DD.YYYY h:mm a',
    formatTime:'h:mm a',
    formatDate:'DD.MM.YYYY',
    inline:false,
    lang:'en',
    onChangeDateTime:function(dp,$input){
      var date_time = Date.parseDate($input.val(), 'MM.DD.YYYY h:mm a');
      rsvpBy = date_time.getTime();
      console.log(starts);
    }
  });
}
