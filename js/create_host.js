function getHostData() {
  return api_call('host', {
                    method: 'GetHost',
                    session: Cookies.get('session')});
}

function setupHostData(hostData) {
	$host_data = $('.host-data');
	console.log(hostData.Prof_pic);
	$('#prof-pic').attr("src", hostData.Prof_pic);
	$host_data.find('#first-name').val(hostData.First_name);
	$host_data.find('#last-name').val(hostData.Last_name);
	$host_data.find('#email').val(hostData.Email);
	$host_data.find('#phone').val(hostData.Phone);
	$host_data.find('#address').val(hostData.Address);
	$("input").keypress(function() {
		console.log("detected a disturbance in the force");
		$host_data.find('button').prop('disabled', false);
    });
	$host_data.find('button').click(function() {
		attemptSendHostData();
	});
}

function attemptSendHostData() {
	console.log("attempting to send host data");
	var submittable = true;
	var errorHtml = ""
	$host_data = $('.host-data');
	console.log("First name @attemptSend:" + $host_data.find('#first-name').val());
	if (!$host_data.find('#first-name').val()) {
		submittable = false;
		errorHtml += "<li>First name is mandatory</li>"
	}
	if (!$host_data.find('#last-name').val()) {
		submittable = false;
		errorHtml += "<li>Last name is mandatory</li>"
	}
	if (!$host_data.find('#email').val()) {
		submittable = false;
		errorHtml += "<li>Email is mandatory</li>"
	}
	var phone_input = $host_data.find('#phone').val()
	if (!phone_input) {
		submittable = false;
		errorHtml += "<li>Phone is mandatory</li>"
	}
	var reg = /^\d+$/;
	if (!reg.test(phone_input)) {
		errorHtml += "<li>Phone must be digits only</li>"
	}
	if (!$host_data.find('#address').val()) {
		submittable = false;
		errorHtml += "<li>Address is mandatory</li>"
	}
	if (!Cookies.get('session')) {
		// show fb login
		submittable = false;
	}
	if (submittable) {
		console.log("Submitting");
		sendHostData();
	} else {
		$('#error-field').html(errorHtml);
	}
}

function sendHostData() {
	$host_data = $('.host-data');
	$host_data.find('#first-name').val();
	$host_data.find('#last-name').val();
	$host_data.find('#email').val();
	$host_data.find('#phone').val();

	var firstName = $host_data.find('#first-name').val();
	var lastName = $host_data.find('#last-name').val();
	var email = $host_data.find('#email').val();
	var phone = $host_data.find('#phone').val();
	var address = $host_data.find('#address').val();
	console.log("first: " + $host_data.find('#first-name').val() + ". Last: " + lastName + ". Email: " + email + ". Phone: " + phone + ". Address: " + address);
	api_resp = api_call('host', {
						method: 'updateHost',
						session: Cookies.get('session'),
						firstName: firstName,
						lastName: lastName,
						email: email,
						phone: phone,
						address: address
						});
	console.log("Sent host data");
	console.log(api_resp);
	if (api_resp.Success) {
	  	$host_data.find('button').prop('disabled', true);
	    $host_data.find('button').html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span> Saved");
	    $host_data.find('button').css("background-color", "#19a347");
	    $host_data.find('button').css("color", "#fff");
		// show the saved button as green, add check mark, disable
	}
}