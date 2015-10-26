api_call = function(api_fragment, data) {
  var response = $.ajax({
                      url: 'api/' + api_fragment,
                      method: 'POST',
                      data: data,
                      dataType: 'json',
                      async: false,
                      }).responseText;
  var api_method = data.method;
  var json_resp = JSON.parse(response);
  console.log(json_resp);
  if (api_method.toLowerCase() === "get" && 
      api_fragment === "kitchenuser" &&
      json_resp.Success && 
      json_resp.Return) {
    guest = json_resp.Return;
  }
  return json_resp;
}
var guest;

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getGuestData() {
  return api_call('kitchenuser', {
                    method: 'Get',
                    session: Cookies.get('session')});
}