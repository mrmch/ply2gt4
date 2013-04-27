// youtube auth shit
var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

function SearchCtrl ($scope) {
    $scope.run_search  = function () {
        var q = $('#search-input').val();
        var request = gapi.client.youtube.search.list({
            q: q,
            maxResults: 10,
            part: 'snippet'
        });

        request.execute(function(response) {
            var str = '';
            for (var i = 0; i < response.items.length; i++) {
                str += '<li>' + response.items[i].snippet.title + '</li>';
            }
            $('#search-results').html(str);
        });
    };

    $scope.results = [
        
    ];
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

