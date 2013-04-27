// youtube auth shit
var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

var myDataRef = new Firebase('https://ply2gt4.firebaseio.com/');

// Search for a given string.
function search () {
    var q = $('#query').val();
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet'
    });

    request.execute(function(response) {
        var str = JSON.stringify(response.result);
        $('#search-container').html('<pre>' + str + '</pre>');
    });
}

// Once the api loads call enable the search box.
function handleAPILoaded () {
    $('#search-button').attr('disabled', false);
    $('#search-button').click(function () { search(); });
}

// called once gapi client is loaded
function OnLoadCallback () {
    gapi.client.setApiKey(google_api_key);
    gapi.client.load('youtube', 'v3', handleAPILoaded);
}

