var firebase = require('firebase');
var config = require("./config");


firebase.initializeApp(config); //Initialize firebase
var quizRef = firebase.database().ref('quizzes');
global.onlineQuizzes = {};

var fetchQuizOnline = function(cb){
	firebase.auth().signInWithEmailAndPassword('anuonifade@gmail.com', 'magnifico').then(() => {
		quizRef.once("value", function(snapshot) {
		  var quizzesOnline = JSON.stringify(snapshot.val());
		  console.log(quizzesOnline);
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
			//cb(error, null);
	 	}  
	});
}

//fetchQuizOnline();

module.exports = {
	fetchQuizOnline : fetchQuizOnline
}