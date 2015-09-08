  api_call = function(api_fragment, data) {
    var response = $.ajax({
                      url: 'api/' + api_fragment,
                      method: 'POST',
                      data: data,
                      dataType: 'json',
                      async: false,}).responseText;
    return JSON.parse(response);
  }