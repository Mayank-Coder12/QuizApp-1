'use strict'

var Table = require('cli-table');
var ProgressBar = require('progress');
var util = require('util');
var command = require('../files/help.json');
var quizzesdb = require('../files/quizzes.json');
var readAnswers = require('readline-sync');
var colors = require('colors');
var onlineQuiz = require('./fetchonlinequiz');


function processCommands(userCommand){

	//Check if the current user is an admin or a regular user.
	//If current user is admin, prompt to switch to a regular user before attempting quiz
	//Display the command to switch to regular user
	//return to original prompt
	//If user is a regular user, proceed to the next stage
	
	if(global.currentUser == undefined){
		global.currentUser = "Anonymous";	
	}
	if(global.activeUserRole == undefined){
		global.activeUserRole = "Regular";
	}
	

	let multipleArgs = userCommand.split(" ");
	if(multipleArgs[0].toLowerCase() == 'user'){
		if(multipleArgs[1] === undefined || multipleArgs[1] === null || multipleArgs[1] === ''){
			//Prompt for user name or nickname
			//Pass the user response to user function to set the current user and role
			var nickName = readAnswers.question("Enter preferred nickname: ");
			global['user'](nickName);
		}
	}

	if(multipleArgs[0].toLowerCase() == 'upload' || multipleArgs[0].toLowerCase() == 'download'){
		if(multipleArgs[1] !== undefined){
			var quizToUploadDownload = getQuiz(multipleArgs[1]);
			global[multipleArgs[0]](quizToUploadDownload);
		}
		else{
			console.log("Command " + multipleArgs[0] + " must have a second argument, identifier of the quiz you want to " + multipleArgs[0]);
			return;
		}
	}

	if(multipleArgs[0].toLowerCase() == 'admin'){
		//If arg 1 and arg 2 is present, pass them into the admin function
		//If arg 1 is present and arg 2 is not, prompt for password.
		//If neither arg 1 nor arg 2 is present, prompt for admin username and password.
		//Pass argument to admin function
	}

	if (multipleArgs.length === 1)
	{
		if(userCommand === '?'){
			userCommand = 'help';
		}
		if(userCommand.length > 0){
			if (userCommand === 'help' || userCommand === '?'){
				commandHelp('help');
			}
			else if(typeof global[userCommand] === 'function'){
				global[userCommand]();
			}
			else{
				console.log("Command is not recognised. Enter help or ? to see the list of commands.\n\n");
			}
		}
		else{
			console.log("You need to enter a command. Enter help or ? to see list of commands.\n\n");
		}
	}
	else if (multipleArgs.length === 2)
	{
		if (multipleArgs[1] === '?'){
			// Check the help documentation of the command before the ? symbol
			commandHelp(multipleArgs[0]);
		}
		else if(multipleArgs[0].toLowerCase() === "importquiz"){
			global[multipleArgs[0]](multipleArgs[1]);
		}
		else{
			console.log('Incorrect command. Enter help or ? to see the list of commands.\n\n');
		}
	}
	
	else if (multipleArgs.length === 3 && multipleArgs[0].toLowerCase() === 'question'){
		global[multipleArgs[0]](multipleArgs[1], multipleArgs[2]);
	}
	else{
		console.log("Incorrect command. Enter help or ? to see the list of commands.\n\n");
	}
		
}

global.online = function(){
	global.quizLocation = 'online';

}

var getQuiz = function(identifier){
	for(var i = 0; i < quizzesdb.length; i++){
		if(quizzesdb[i].identifier == identifier){
			return quizzesdb[i];
		}
	}
}

global.done = function(){
	//Called when the user is done with the Quiz.
	//It displays user's responses to questions and the grade in percentage.
	//Unset importedQuestions and userResponses or to null or unset the global variable

	if(Object.keys(global.userResponses).length < 1){
		console.log("You did not attempt any question?");
		console.log("Anyway, thank you " + global.currentUser + " for using QUIZAPP, We hope you it again");		
		return;
	}
	
	var correctCount = 0;
	var totalQuestion = Object.keys(global.importedQuestions).length;
	global.wrongAnswers = {};
	for(var questionKeys in global.importedAnswers){
		if(global.importedAnswers[questionKeys] == global.userResponses[questionKeys]){
			correctCount++;
		}
		else{
			global.wrongAnswers[questionKeys] = global.importedQuestions.body;
		}
	}
	var percentScore = Number.parseFloat(correctCount / totalQuestion * 100, 2);
	console.log("\nThis is your Quiz details");
	console.log("===========================");
	console.log("\n");
	console.log("Hello " + global.currentUser + " check your Quiz details below\n");
	console.log("Total Questions Attempted: " + Object.keys(global.userResponses).length);
	console.log("Total Correct answers: " + correctCount);
	console.log("Total incorrect answers: " + Object.keys(global.wrongAnswers).length);
	console.log("Percentage Score: " + percentScore);
	console.log("You can take more quiz by simply importing using - importquiz <quiz-identifier>. listquizzes to list all quizzes available");
	delete global.userResponses;
	delete global.importedQuestions;
	delete global.importedAnswers;
}

global.question = function(questionNum, userChoice){

	/*Get the question answered by user and their choice.
	* If the option is not part of the options available for the Quiz question, do not store user's choice 
	* If the user enters an incorrect question number, the user is prompted by the asked to enter the correct question number
	* If the user enters the correct question number and option, user's choice is save in a user object userResponses 
	* with the question id as the key and choice and the value.
	*/
	var isOptionValid = false;
	var isQuestionNumberValid = false;
	userChoice = userChoice.toUpperCase()

	for(var questionID in global.importedQuestions){

		if(global.importedQuestions[questionID]['number'] == questionNum){
			isQuestionNumberValid = true;
			for(var option in global.importedQuestions[questionID]['options']){
				if(option == userChoice){
					isOptionValid = true;
					global.userResponses[questionID] = userChoice;
					break;
				}
			}
			if(isOptionValid == false){
				console.log("Your answer is not a valid option, check question " + questionNum + " for the right options");
				break;
			}
		}
	}
	if(isQuestionNumberValid == false){
		console.log("Question number is invalid. Enter the correct question number");
	}
	else if(isQuestionNumberValid && isOptionValid){
		for(var keyID in userResponses){
			console.log("Question: " + importedQuestions[keyID]['number'] + " Choice: "  + userResponses[keyID]);
		}
		console.log("Enter the command - done - if you are done with your answers");
	}
	else if(!isQuestionNumberValid && !isOptionValid){
		console.log("Enter a valid command in the form - question <question_number> <your_choice> e.g question 10 B");
	}
	else{
		processCommand();
	}
}



function commandHelp(findHelpCommand){
	var userCommand = "";
	if(findHelpCommand == "?"){
		userCommand = 'help';
	}
	else{
		userCommand = findHelpCommand;
	}

	if(command.commands[userCommand] !== undefined){
		console.log(command.commands[userCommand]['content']);
	}
	else{
		console.log("There is no documentation for the command.\n\n");
	}

}

global.listquizzes = function(){
	var tableListOfQuizzes = new Table({
		head: ["S/N", "Quiz Name", "Quiz identifier", "Quiz Description", "Quiz Duration"]
	});
	// List all the quizzes
	console.log("\n\n");
	console.log("List of all Quizzes available");
	for(var i = 0; i < quizzesdb['quizzes'].length; i++){
		var quizzesList = quizzesdb['quizzes'];
		var output = new Array();
		var mins = quizzesList[i]['duration'] / 60;
		var secs = quizzesList[i]['duration'] % 60;
		var duration = mins + "mins " + secs + "secs";
		output.push(i + 1, quizzesList[i]['name'], quizzesList[i]['identifier'], quizzesList[i]['description'], duration);
		tableListOfQuizzes.push(output);
	}
	console.log(tableListOfQuizzes.toString());
	console.log("To take a quiz, you need to import using the command - importquiz <quiz_identifier> e.g importquiz general-knowledge-1");
	console.log("\n");
}

global.importquiz = function(identifier){
	// import quiz 
	var foundQuiz = false;
	for(var i = 0; i < quizzesdb.quizzes.length; i++){
		if(quizzesdb.quizzes[i]['identifier'] === identifier){
			global.importedQuiz = quizzesdb.quizzes[i];
			foundQuiz = true;
			break;
		}
	}
	var len = quizzesdb.quizzes.length;
	var bar = new ProgressBar('[:bar] :percent', { total: 10 });
	var timer = setInterval(function () {
		bar.tick();
	    console.log('\nImport completed\n');
	    if(bar.complete){
	    	if(foundQuiz){
				console.log("You have successfully imported the quiz (" + global.importedQuiz['name'] + ") ");
				console.log("To take Quiz, use the command - takequiz");
				console.log("\n");
			}
			else{
				console.log("Unable to locate Quiz, Run listquizzes command to view available quizzes.");
			}
			clearInterval(timer);
	    }
	}, 100);
	if(foundQuiz){
		console.log("You have successfully imported the quiz (" + global.importedQuiz['name'].toUpperCase() + ") ");
		console.log("To take Quiz, use the command - takequiz");
		console.log("\n");
	}
	else{
		console.log("Unable to locate Quiz, Run listquizzes command to view available quizzes.");
	}
}

global.takequiz = function(){
	//Check if the any Quiz is actively imported
	if (global.importedQuiz === undefined){
		console.log("\n");
		console.log("You did not import any quiz. You need to import quiz before you can take it. Use the command help or importquiz ? for details");
		console.log("\n");
	}
	else{
		// Activate quiz and list quiz questions one after the other.
		util.print("\u001b[2J\u001b[0;0H");
		global.userResponses = {};
		global.importedQuestions = global.importedQuiz.questions;
		global.importedAnswers = global.importedQuiz.answers;
		console.log("                     WELCOME TO QUIZAPP CONSOLE APP");
		console.log("============================****************============================");
		console.log("QUIZ NAME: " + global.importedQuiz['name']);
		console.log("QUIZ DESCRIPTION: " + global.importedQuiz['description']);
		console.log("QUIZ DURATION: " + global.importedQuiz['duration']);
		console.log("============================***************=============================");
		console.log("\n");
		console.log("Quiz Instructions");
		console.log("===================");
		console.log("1. Answer all questions.");
		console.log("2. You can answer the question in any order.");
		console.log("3. To answer a question use the command <question><space><number><space><option> e.g question 2 A");
		console.log("4. You can change your answers as many times as you want. Only the final answer will be stored.");
		console.log("5. To view your progress so far, use the command - view progress. All the questions you have answered so far will be listed with your choice.");
		console.log("6. When you are done, use the command - done to submit and view your result.");
		console.log("7. If you are unable to finish before the given time, the quiz is submitted automatically and your quiz graded");
		console.log("\n");
		console.log("\n");
		console.log("Use the command (start) - to start taking quiz. (Note: that your time starts once you enter start command)");
		console.log("\n");
	}
}

global.admin = function(nickName, password){
	//Check if user is currently taking quiz, 
	//If yes, ask if the user wish to exit the current quiz
	//If yes unset importedQuiz and userResponses global variable to reset Quiz and User's answers
	// Try to switch user to admin user in
}

global.user = function(nickName){
	// Switch user to a Regular user
	if(nickName === undefined || nickName === null){
		var nickName = readAnswers.question("Nickname: ");
	}
	global.currentUser = nickName.toUpperCase();
	global.activeUserRole = "Regular";
}

global.download = function(){
	console.log("Called the download function");
	if(global.currentUser && global.activeUserRole === 'admin'){
		//Perform download
	}
}

global.upload = function(){
	console.log("Called the upload function");
	if(global.currentUser && global.activeUserRole === 'admin'){
		//Perform the upload
	}
}

global.clear = function(){
	//This function clears the screen.
	util.print("\u001b[2J\u001b[0;0H");
}


global.startTakingQuiz = function(){

	//This function is called by the start function of the start command. 
	//It displays all the questions at once and start the timer in the background
	// The time call the done command once time is up
	console.log("Questions");
	console.log("============");
	var sNum = 1;
	for(var id in global.importedQuestions){
		global.importedQuestions[id].number = sNum;
		console.log( "(" + sNum + ")" + " " + global.importedQuestions[id].body);
		for (var option in global.importedQuestions[id].options)
		{
			console.log( "\t(" + option + ") " + global.importedQuestions[id].options[option]);
		}
		console.log("\n");

		sNum++;	
	}
}	

global.start = function(){
	//This function starts a quiz already imported and ready to be taken.
	//If a quiz is not initialized, the prompt request to run the command - takequiz if any quiz is already imported.
	//When quiz is initialized, a user can run the command - start to start taking a Quiz

	if(global.userResponses === undefined){
		console.log("You need to run 'takequiz' before starting a quiz");
	}
	else{
		global.startTakingQuiz();	
	}
}

module.exports = {
	processCommands : processCommands,
	commandHelp : commandHelp,
	listquizzes : listquizzes,
	importquiz : importquiz,
	takequiz : takequiz,
	clear : clear,
	done : done,
	startTakingQuiz : startTakingQuiz,
	admin : admin,
	user : user
}