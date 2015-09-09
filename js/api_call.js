  api_call = function(api_fragment, data) {
    var response = $.ajax({
                      url: 'api/' + api_fragment,
                      method: 'POST',
                      data: data,
                      dataType: 'json',
                      async: false,}).responseText;
    return JSON.parse(response);
  }

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}