require('dotenv').config();
var firebase = require('firebase');


global.quizzes = {};
var getOnlineQuizzes = function(){
	var config = {
	    apiKey: "AIzaSyDTAk1mxL6i--NeVzWgNkSm0pI627xJUfU",
	    authDomain: "quizapp-e874a.firebaseapp.com",
	    databaseURL: "https://quizapp-e874a.firebaseio.com",
	    storageBucket: "quizapp-e874a.appspot.com",
	    messagingSenderId: "1084653091557"
	};
	firebase.initializeApp(config); //Initialize firebase
	var quizRef = firebase.database().ref('quizzes');

	firebase.auth().signInWithEmailAndPassword(process.env.FIREBASE_EMAIL, process.env.FIREBASE_PASSWORD).then(() => {
		quizRef.once("value", function(snapshot) {
			//Gets online quizzes here
			global.quizzes = snapshot.val();
			//console.log(global.quizzes);
		}, function(error){
			console.log(error);
		});
		}).catch(function(error) {
		// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if(errorCode !== undefined){
			console.log("Unable to Authenticate for firebase with the following errors ");
			console.log(errorCode + ": " + errorMessage);
	 	}  
	});
}

module.exports = getOnlineQuizzes;
