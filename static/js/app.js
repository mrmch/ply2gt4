// youtube auth shit
var google_api_key = 'AIzaSyDSw1FRDGu_3-I6lmoGjAGDUMM0dOgavZc';

var userID = new Date().getTime();

//var roomRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room);
//var usersRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room + '/users');

var base = 'https://ply2gt4.firebaseio.com/rooms/',
    room_url = base + PLY2GT4.room,
    users_url = room_url + '/users/',
    user_url = users_url + userID,
    playlistURL = user_url + '/playlist';

var room = new Firebase(room_url);
var users = room.child('users'),
    users_val = null,
    room_pl = room.child('playlist'),
    room_pl_val = null;
var user = new Firebase(user_url);

var last_user = room.child('last_user'),
    last_user_val;
var last_user_playlist

// del user on disconnect
user.onDisconnect().remove();

last_user.once('value', function (snapshot) {
    if (snapshot.val() === null) {
        last_user.set(userID);
    }
});

last_user.on('value', function (snapshot) {
    last_user_val = snapshot.val();
});

users.on('value', function (snapshot) {
    users_val = snapshot.val();
});

room_pl.on('value', function (snapshot) {
    room_pl_val = snapshot;
});

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
    var promise = angularFire(user_url, $scope, 'user', {});
    pormiseB = promise.then(function () { 
        $scope.user.username = new Date().getTime();
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
}])

.controller('RoomPlaylistCtrl', ['$scope', function ($scope) {
    $scope.users = users_val;

    $scope.userNextClip = function (user) {
        int pl = user.playlist;
        if (pl.len < 1) return;

        return user.playlist[0];
    };
}])

.controller('PlayerCtrl', ['$scope', '$window', 'playlistService', function ($scope, $window, playlistService) {
    playlistService.getPlaylist($scope);
    var params = { allowScriptAccess: "always" },
        atts = { id: "ytapiplayer" },
        options = 'enablejsapi=1&playerapiid=ytplayer&version=3&controls=0';


    $scope.ytplayer = null;

    $scope.currentSongID = function () {
        var pl = users_val[last_user_val].playlist;

        if (pl.len < 1) return;

        return pl[0].id.videoId;
    };

    $scope.nextSong = function () {
        if (last_user_val == userID) {
            // increment our local  playlist
            var last = $scope.playlist.shift();
            $scope.playlist.push(last);
        }

        users.transaction(function (currentUsers) {
            var last = last_user_val;

            var l = 0;
            for (key in currentUsers){ l++; }
            users.child(last_user_val).setPriority(l + 1);

            // now we find the top user
            var toset = 0;
            for (key in currentUsers){ toset = key; break; }
            last_user.set(toset);

            return currentUsers;
        });
    };

    $scope.play = function () {
        swfobject.embedSWF("http://www.youtube.com/v/" + $scope.currentSongID() + "?" + options,
            "ytapiplayer", "425", "356", "8", null, null, params, atts);
    };

    $scope.skip = function () {
        $scope.nextSong();
        $scope.play();
    };

    $window.playerCtrlYTReady = function (ytplayer) {
        $scope.ytplayer = ytplayer;
        $scope.ytplayer.playVideo();
    };

    $window.playerCtrlYTStateChange = function (newState) {
        console.log('new state', newState);
        if (newState == 0) {
            // ended
            $scope.skip();
        }
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

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById("ytapiplayer");
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    window.playerCtrlYTReady(ytplayer);
}

function onytplayerStateChange(newState) {
    window.playerCtrlYTStateChange(newState);
}
