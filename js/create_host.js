function setupHostData(guestData) {
	$host_data = $('#host-data');
	$host_data.load('include/host_data.html')
	console.log(guestData);
	$host_data.find('#first-name').val(guestData.First_name);
	$host_data.find('#last-name').val(guestData.Last_name);
	$host_data.find('#email').val(guestData.Email);
	$("input[type='text']").change(function() {
		console.log("detected a disturbance in the force");
		$host_data.find('button').prop('disabled', false);
    });
	$host_data.find('button').click(attemptSendHostData());
}

function attemptSendHostData() {
	var submittable = true;
	var errorHtml = ""
	$host_data = $('#host-data');
	if (!$host_data.find('Efirst-name').val()) {
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
	if (!Cookies.get('#session')) {
		// show fb login
		submittable = false;
	}
	if (submittable) {
		sendHostData();
	} 
}
function sendHostData() {
	$host_data = $('#host-data');
	var firstName = $host_data.find('#first-name').val();
	var lastName = $host_data.find('#last-name').val();
	var email = $host_data.find('#email').val();
	var phone = $host_data.find('#phone').val();
	var address = $host_data.find('#address').val();

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