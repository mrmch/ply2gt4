function AppViewModel() {
    var self = this;

    self.roomName = ko.observable(PLY2GT4.room);
    self.username = ko.observable('poopfeast');
};

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

/*
    var params = { allowScriptAccess: "always" },
        atts = { id: "ytapiplayer" },
        options = 'enablejsapi=1&playerapiid=ytplayer&version=3&controls=0';

    $scope.ytplayer = null;

    $scope.currentSongID = function () {
        if ($scope.playlist.length < 1) return;
        return $scope.playlist[0].id.videoId;
    };

    $scope.nextSong = function () {
        var last = $scope.playlist.shift();
        $scope.playlist.push(last);
    };

    $scope.play = function () {
        swfobject.embedSWF("http://www.youtube.com/v/" + $scope.currentSongID() + "?" + options,
            "ytapiplayer", "425", "356", "8", null, null, params, atts);
    };

    $window.playerCtrlYTReady = function (ytplayer) {
        $scope.ytplayer = ytplayer;
        $scope.ytplayer.playVideo();
    };

    $window.playerCtrlYTStateChange = function (newState) {
    
    };
*/

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

ko.applyBindings(new AppViewModel());
