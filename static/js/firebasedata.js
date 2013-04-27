$(document).ready(function () {
	var roomRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room);
	var usersRef = new Firebase('https://ply2gt5.firebaseio.com/rooms/' + PLY2GT4.room + '/users');

	var userRef = usersRef.push();
	userRef.set({ 'username' : 'poopfeast'});


	userRef.on('value', function(snapshot) {
		console.log(snapshot.val());
	});

	

	



	// usersRef.on('child_added', function(childSnapshot, prevChildName){

	// 	alert(childSnapshot.val().slug);

	// });



	//roomRef.on('value', function(dataSnapshot) {
	//	console.log(dataSnapshot.val());
	//});

});
