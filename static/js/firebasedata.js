$(document).ready(function () {
	var firebaseRef = new Firebase('https://ply2gt5.firebaseio.com/')
	var roomRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room);
	var usersRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room + '/users');





	usersRef.child(new Date().getTime()).set({'slug' : 'poopfeast'});



	// usersRef.on('child_added', function(childSnapshot, prevChildName){

	// 	alert(childSnapshot.val().slug);

	// });



	//roomRef.on('value', function(dataSnapshot) {
	//	console.log(dataSnapshot.val());
	//});

});
