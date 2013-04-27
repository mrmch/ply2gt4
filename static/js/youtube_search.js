// youtube auth shit
var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

function SearchCtrl ($scope) {
    $scope.runSearch  = function () {
        var q = $('#search-input').val();
        var request = gapi.client.youtube.search.list({
            q: q,
            maxResults: 10,
            part: 'snippet'
        });

        request.execute(function(response) {
            $scope.results = [];
            for (var i = 0; i < response.items.length; i++) {
                $scope.results.append(response.items[i]);
            }
        });
    };

    $scope.results = [
        
    ];
}

// Once the api loads call enable the search box.
function handleAPILoaded () {
    $('#search-button').attr('disabled', false);
}

// called once gapi client is loaded
function OnLoadCallback () {
    gapi.client.setApiKey(google_api_key);
    gapi.client.load('youtube', 'v3', handleAPILoaded);
}

