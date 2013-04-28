//$(document).ready(function() {

    // youtube auth shit
    var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

    var userID = new Date().getTime();

    var roomURL = 'https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room;
    var userURL = roomURL + '/users/' + userID;
    var playlistURL = userURL + '/playlist';

    angular.module('ply2gt4', ['firebase'], function ($provide) {
        $provide.factory('playlistService', ['angularFire', function(angularFire) {
            var playlistService = {};

            playlistService.getPlaylist = function ($scope) {
                var promise = angularFire(playlistURL, $scope, 'playlist', []);
                promise.then(function () { 
                    $scope.addToPlaylist = function (clip) {
                        $scope.playlist.push(clip);
                    };

                    $scope.removeClip = function (clip) {
                        $scope.playlist = [];
                    };
                })
                return promise;
            };

            return playlistService;
        }]);
    })

    .controller('PlaylistCtrl', ['$scope', 'playlistService', function ($scope, playlistService) {
        playlistService.getPlaylist($scope);
    }])

    .controller('UserCtrl', ['$scope', 'angularFire', function ($scope, angularFire) {
        var promise = angularFire(userURL, $scope, 'user', {});
        promise.then(function () { 
            $scope.user.username = 'poopfeast';
       });
    }])

    .controller('SearchCtrl', ['$scope', 'playlistService', function ($scope, playlistService) {
        playlistService.getPlaylist($scope);
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

//});