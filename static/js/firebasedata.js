var roomsRef = new Firebase('https://ocf0s8prdzo.firebaseio-demo.com/rooms');

var room = roomRef.pus();
room.set({slug:"test"});