function AppViewModel() {
    var self = this;

    self.roomName = ko.observable(PLY2GT4.room);
    self.username = ko.observable('poopfeast');

    ko.computed(function () {
        var fbRoomURL = 'https://ply2gt5.firebaseio.com/' + self.roomName();
        var fbRoomRef = new Firebase(fbRoomURL);

        fbRoomRef.once('value', function (dataSnapshot) {
            if (dataSnapshot.val() === null) {
                fbRoomRef.child('users').push();
            }
        });

        fbRoomRef.child('users').set({'one':'two'});
    });
};

ko.applyBindings(new AppViewModel());
