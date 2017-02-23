'use strict'

var Table = require('cli-table');
var ProgressBar = require('progress');
var util = require('util');
var command = require('../files/help.json');
var quizzesdb = require('../files/quizzes.json');
var readAnswers = require('readline-sync');
var colors = require('colors');
var onlineQuiz = require('./getonlinequiz');



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

	global.quizLocation = offline;

	let multipleArgs = userCommand.split(" ");
	if(multipleArgs[0].toLowerCase() == 'user' && multipleArgs[1] !== '?'){
		if(multipleArgs[1] === undefined || multipleArgs[1] === null || multipleArgs[1] === ''){
			//Prompt for user name or nickname
			//Pass the user response to user function to set the current user and role
			var nickName = multipleArgs[1];
			global['user'](nickName);
			return;
		}
	}
	if(multipleArgs[0].toLowerCase() == 'q' && multipleArgs[1] !== '?'){
		global['question'](multipleArgs[1], multipleArgs[2]);
		return;
	}
	if(multipleArgs[0].toLowerCase() == 'page' && multipleArgs[1] != '?'){
		global['page'](multipleArgs[1]);
		return;
	}

	if((multipleArgs[0].toLowerCase() == 'upload' || multipleArgs[0].toLowerCase() == 'download') && multipleArgs[1] !== '?'){
		if(multipleArgs[1] !== undefined){
			var quizToUploadDownload = getQuiz(multipleArgs[1]);
			global[multipleArgs[0]](quizToUploadDownload);
		}
		else{
			console.log(colors.bold.red("Command %s must have a second argument, identifier of the quiz you want to %s"), multipleArgs[0],  multipleArgs[0]);
			return;
		}
	}

	if(multipleArgs[0].toLowerCase() == 'admin' && multipleArgs[1] !== '?'){
		global['admin'](multipleArgs[1], multipleArgs[2]);
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
				console.log("Command is not recognised. Enter help or ? to see the list of commands.".bold.red);
			}
		}
		else{
			console.log("You need to enter a command. Enter help or ? to see list of commands.".bold.red);
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

global.offline = function(){
	global.quizLocation = 'offline';
}

var getQuiz = function(identifier){
	if(global.quizLocation == 'offline'){
		for(var i = 0; i < quizzesdb.length; i++){
			if(quizzesdb[i].identifier == identifier){
				return quizzesdb[i];
			}
		}
	}
	else if(global.quizLocation == 'online'){
		onlineQuiz.getOnlineQuizzes();
		quizzesdb = global.quizzes;
		for(var i = 0; i < onlineQuiz.length; i++){
			if(onlineQuiz[i].identifier == identifier){
				return onlineQuiz[i];
			}
		}
	}
	else{
		console.log(colors.red("You need to indicate online or offline for your quiz by running any of the commands - online or offline"))
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
	console.log(colors.bold.cyan("\nThis is your Quiz details"));
	console.log("===========================");
	console.log("\n");
	console.log(colors.bold.cyan("Hello %s check your Quiz details below\n"), global.currentUser );
	console.log(colors.bold.cyan("Total Questions Attempted: %d"), Object.keys(global.userResponses).length);
	console.log(colors.bold.cyan("Total Correct answers: %d"),correctCount);
	console.log(colors.bold.cyan("Total incorrect answers: %d"), Object.keys(global.wrongAnswers).length);
	console.log(colors.bold.cyan("Percentage Score: %d"), percentScore);
	console.log(colors.bold.green("You can take more quiz by simply importing using - importquiz <quiz-identifier>. listquizzes to list all quizzes available"));
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
		console.log("Enter a valid command in the form - question <question_number> <your_choice> e.g question 10 B or q 10 b");
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
	console.log("List of all Quizzes available".underline.bold.green);
	for(var i = 0; i < quizzesdb['quizzes'].length; i++){
		var quizzesList = quizzesdb['quizzes'];
		var output = new Array();
		var mins = quizzesList[i]['duration'] / 60;
		var secs = quizzesList[i]['duration'] % 60;
		var duration = mins + "mins " + secs + "secs";
		output.push(i + 1, quizzesList[i]['name'], quizzesList[i]['identifier'], quizzesList[i]['description'], duration);
		tableListOfQuizzes.push(output);
	}
	console.log(colors.blue(tableListOfQuizzes.toString()));
	console.log("To take a quiz, you need to import using the command - importquiz <quiz_identifier> e.g importquiz general-knowledge-1".bold.green);
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
				console.log(colors.green("You have successfully imported the quiz (%s) "), global.importedQuiz['name']);
				console.log(colors.green("To take Quiz, use the command - takequiz"));
				console.log("\n");
			}
			else{
				console.log("Unable to locate Quiz, Run listquizzes command to view available quizzes.");
			}
			clearInterval(timer);
	    }
	}, 100);
	if(foundQuiz){
		console.log(colors.green("You have successfully imported the quiz (%s) "), global.importedQuiz['name']);
		console.log(colors.green("To take Quiz, use the command - takequiz"));
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
		console.log("                     WELCOME TO QUIZAPP CONSOLE APP".bold.red);
		console.log("============================****************============================".bold.green);
		console.log(colors.yellow("QUIZ NAME: %s"), global.importedQuiz['name']);
		console.log(colors.yellow("QUIZ DESCRIPTION: %s"), global.importedQuiz['description']);
		console.log(colors.yellow("QUIZ DURATION: %s mins %s secs"), Math.floor(global.importedQuiz['duration'] / 60), global.importedQuiz['duration'] % 60);
		console.log("============================***************=============================".bold.green);
		console.log("\n");
		console.log(colors.cyan("Quiz Instructions"));
		console.log("===================".rainbow);
		console.log(colors.cyan("1. Answer all questions."));
		console.log(colors.cyan("2. You can answer the question in any order."));
		console.log(colors.cyan("3. To answer a question use the command <question><space><number><space><option> or <q><space><number><space><option> e.g question 2 A or q 10 A"));
		console.log(colors.cyan("4. You can change your answers as many times as you want. Only the final answer will be stored."));
		console.log(colors.cyan("5. To view your progress so far, use the command - view progress. All the questions you have answered so far will be listed with your choice."));
		console.log(colors.cyan("6. When you are done, use the command - done to submit and view your result."));
		console.log(colors.cyan("7. If you are unable to finish before the given time, the quiz is submitted automatically and your quiz graded"));
		console.log("\n");
		console.log("\n");
		console.log(colors.green("Use the command (start) - to start taking quiz. (Note: that your time starts once you enter start command)"));
		console.log("\n");
	}
}

global.admin = function(nickName, password){
	//Check if user is currently taking quiz, 
	//If yes, ask if the user wish to exit the current quiz
	//If yes unset importedQuiz and userResponses global variable to reset Quiz and User's answers
	//Try to switch user to admin users
}

global.user = function(nickName){
	// Switch user to a Regular user
	if(nickName === undefined || nickName === null){
		var nickName = readAnswers.question("Enter your Nickname: ");
	}
	global.currentUser = nickName.toUpperCase();
	global.activeUserRole = "Regular";
}

global.download = function(quizIdentifier){
	//Downloads identified quiz to local database
}

global.upload = function(quizIdentifier){
	//Uploads identified quiz to online database
}

global.clear = function(){
	//This function clears the screen.
	util.print("\u001b[2J\u001b[0;0H");
}


global.startTakingQuiz = function(){

	//This function is called by the start function of the start command. 
	//It displays all the questions
	//var currentNumber = 0;
	global.questionToNumber = [];
	for(var id in global.importedQuestions){
		global.questionToNumber.push(global.importedQuestions[id]);
	}
	//console.log(global.questionToNumber);
	//process.exit();
	global.currentPage = 1;
	global.nextPage(0, 4);
}	

global.nextPage = function (startNumber, lastNumber){
	for(var i = startNumber; i <= lastNumber; i++){
		
		global.questionToNumber[i].number = (i + 1);
		console.log( "(" + (i + 1) + ")" + " " + global.questionToNumber[i].body);
		for (var option in global.questionToNumber[i].options)
		{
			console.log( "\t(" + option + ") " + global.questionToNumber[i].options[option]);
		}
		console.log("\n");
		console.log(colors.cyan('You can switch between pages or answer questions using the commands below'));
		console.log("next => Next Page \t prev => Previous page \t page <page_number> => Switch to the page_number".bold.green);
		console.log("q 1 A => Question 1 option A or you can write command in full, question 1 A => Question 1 option A".bold.green);
		console.log("\n");
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
		console.log("Questions");
		console.log("============");
		global.startTakingQuiz();		
	}

}

global.prev = function(){
	if (global.currentPage == 1){
		console.log("No more previous page, this is the first page");
	}
	else{
		global.page(global.currentPage - 1);
	}
}
global.next = function(){
	if (global.currentPage == (global.questionToNumber.length / 5)){
		console.log("No more next page, this is the last page");
	}
	else{
		global.page(global.currentPage + 1);
	}
}
global.page = function(pageNumber){
	//console.log("It got here also");
	global.currentPage = pageNumber;
	var pageStartNumber = (pageNumber - 1) * 5 ;
	var pageLastNumber = (pageNumber * 5) - 1;

	global.nextPage(pageStartNumber, pageLastNumber);

}
global.firstpage = function(){
	global.currentPage = 1;
	var pageStartNumber = 0;
	var pageLastNumber = 4;
	global.nextPage(pageStartNumber, pageLastNumber);
}
global.lastpage = function(){
	global.currentPage = global.questionToNumber.length / 5;
	var pageStartNumber = global.questionToNumber.length - 5;
	var pageLastNumber = global.questionToNumber.length - 1;
	global.nextPage(pageStartNumber, pageLastNumber);
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