
function AppViewModel() {
    var self = this;

    self.loaded = ko.observable(false);

    var username = PLY2GT4.username;

    self.room = ko.observable({
        'users': [],
    });
    self.nowPlaying = ko.observable({
        'username': '',
        'playitem': ''
    });
    self.user = ko.observable({'username': '', 'playlist': []});

    self.roomName = ko.observable(PLY2GT4.room);
    self.username = ko.observable(username);

    // Firebase
    self.fbRoomRef = new Firebase('https://ply2gt5.firebaseio.com/' + self.roomName());
    self.fbRoomRef.update({'name':self.roomName()});
    self.fbRoomRef.on('value', function(roomSnapshot) {
        var newRoom = {};
        var roomData = roomSnapshot.val();

        newRoom.name = roomData.name;

        var users = [];
        roomSnapshot.child('users').forEach(function (userSnapshot) {
            var user = userSnapshot.val();

            var playlist = [];
            userSnapshot.child('playlist').forEach(function (playItemSnapshot) {
                playlist.push(playItemSnapshot.val());
            });
            user.playlist = playlist;

            users.push(user);

            if (user.username === username) {
                self.user(user);
            }
        });
        newRoom.users = users;

        self.room(newRoom);

        if (roomData.hasOwnProperty('nowPlaying')) {
            self.nowPlaying(roomData.nowPlaying);   

        }
        
        self.loaded(true);
    });

    self.fbUserRef = self.fbRoomRef.child('users').child(username);
    self.fbUserRef.setWithPriority({
            'username':self.username()
        },
        new Date().getTime()
    );
    self.fbUserRef.onDisconnect().remove();
    
    self.fbPlaylistRef = self.fbUserRef.child('playlist');

    self.queueItem = function () {
        var priority = new Date().getTime();
        var playlistLength = self.user().playlist.length;

        self.fbPlaylistRef.child(playlistLength).setWithPriority({
                'playitem':'item ' + playlistLength
            },
            priority  
        );
    };

    self.playNext = function () {
        self.fbRoomRef.child('users').once('value', function(usersSnapshot) {
            var done = false;
            usersSnapshot.forEach(function (userSnapshot) {
                userSnapshot.child('playlist').forEach(function (playItemSnapshot) {
                    if (!done) {
                        playItemSnapshot.ref().setPriority(new Date().getTime());
                        userSnapshot.ref().setPriority(new Date().getTime());

                        self.fbRoomRef.child('nowPlaying').set({
                            'username': userSnapshot.val().username,
                            'playitem': playItemSnapshot.val().playitem
                        });

                        done = true;
                    }
                });
            });
        });
    };
};

ko.applyBindings(new AppViewModel());
