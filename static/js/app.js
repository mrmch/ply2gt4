function AppViewModel() {
    var self = this;

    self.roomName = ko.observable(PLY2GT4.room);
    self.username = ko.observable('poopfeast');
};

ko.applyBindings(new AppViewModel());
