// youtube auth shit
var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

/*
angular.module('phonecat', []).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/phones', {templateUrl: 'partials/phone-list.html',   controller: PhoneListCtrl}).
    when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
    otherwise({redirectTo: '/phones'});
}]);
*/

angular.module('ply2gt4', [])
.service('playlistService', function () {
    var data = [];

    return {
        playlist: function () {
            return data;
        },
        addClip: function (clip) {
            data.push(clip)
            return;
        },
        removeClip: function (clip) {
            // todo
            return;
        }
    };
})
.controller('PlaylistCtrl', ['$scope', 'playlistService', function ($scope, playlistService) {
    $scope.getPlaylist = function () {
        return playlistService.playlist();
    };
}]).controller('SearchCtrl', ['$scope', 'playlistService', function ($scope, playlistService) {
    $scope.searchResults = [];

    $scope.runSearch  = function () {
        var q = $scope.searchText;
        var request = gapi.client.youtube.search.list({
            q: q,
            maxResults: 10,
            part: 'snippet'
        });

        request.execute(function(response) {
            $scope.searchResults = [];
            for (var i = 0; i < response.items.length; i++) {
                $scope.searchResults.push(response.items[i]);
            }
        });
    };

    $scope.addToPlaylist = function (result) {
        playlistService.addClip(result);
    };

}]);

// Once the api loads call enable the search box.
function handleAPILoaded () {
    $('#search-button').attr('disabled', false);
}

// called once gapi client is loaded
function OnLoadCallback () {
    gapi.client.setApiKey(google_api_key);
    gapi.client.load('youtube', 'v3', handleAPILoaded);
}

