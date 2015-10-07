function getMealDraft() {
	// some shit
  	return api_call('meal', {
                    method: 'GetMealDraft',
                    session: Cookies.get('session')});
}

function setupMealDraft(meal_draft) {
	$meal_inputs = $('.meal-data');
	console.log(hostData.Prof_pic);
	$meal_inputs.find('#title').val(meal_draft.Title);
	$meal_inputs.find('#description').val(meal_draft.Description);
	$meal_inputs.find('#price').val(meal_draft.Price);
	$meal_inputs.find('#seats').html(meal_draft.Seats +' <span class="caret"></span>');
	// todo: add start and end times
	// $meal_inputs.find('#start_time').val(hostData.Address);
	if (!hostData.Stripe_connect) {
		$('#stripe-warning').html(
        "<li><span class='glyphicon glyphicon-cutlery' aria-hidden='true'></span>" +
          "Please save your data BEFORE you connect with Stripe. You must connect with Stripe to host on Chakula." +
          "</li>"
			);
	}
	$("input").keypress(function() {
		console.log("detected a disturbance in the force");
		$meal_inputs.find('#save').prop('disabled', false);
		$meal_inputs.find('#publish').prop('disabled', true);
		// TODO: set text to "save", remove checkmark, restore old color styling
    });
	$meal_inputs.find('#save').click(function() {
		attemptSaveDraft();
	});
	$meal_inputs.find('#publish').click(function() {
		publishDraft();
	});

}

function attemptSaveDraft() {
	console.log("attempting to save meal data");
	var submittable = true;
	var errorHtml = ""
	// Meal title empty?
	// description empty?
	// Price !numeric?
	// RSVP by time > Meal Start time?
	$meal_inputs.find('#save').prop('disabled', true);
	$meal_inputs.find('#publish').prop('disabled', false);

}

function publishDraft() {

	// return api_call('meal', {
    //                 method: 'SaveMealDraft',
    //                 session: Cookies.get('session'),
    //             	id: });
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