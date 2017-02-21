'use strict'

var Table = require('cli-table');
var ProgressBar = require('progress');
var util = require('util');
var command = require('../files/help.json');
var quizzesdb = require('../files/quizzes.json');
var readAnswers = require('readline');
var colors = require('colors');


function processCommands(userCommand){
	let checkDoubleCommand = userCommand.split(" ");
	if (checkDoubleCommand.length === 1)
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
				console.log(typeof(userCommand));
				console.log("Command is not recognised. Enter help or ? to see the list of commands.\n\n");
			}
		}
		else{
			console.log("You need to enter a command. Enter help or ? to see list of commands.\n\n");
		}
	}
	else if (checkDoubleCommand.length === 2)
	{
		if (checkDoubleCommand[1] === '?'){
			// Check the help documentation of the command before the ? symbol
			commandHelp(checkDoubleCommand[0]);
		}
		else if(checkDoubleCommand[0].toLowerCase() === "importquiz"){
			global[checkDoubleCommand[0]](checkDoubleCommand[1]);

		}
		else{
			console.log('Incorrect command. Enter help or ? to see the list of commands.\n\n');
		}
	}
	else if (checkDoubleCommand.length === 3 && checkDoubleCommand[0].toLowerCase() === 'admin'){
		//Check if the user exit and switch current user to the admin.
	}
	else{
		console.log("Incorrect command. Enter help or ? to see the list of commands.\n\n");
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
		output.push(i + 1, quizzesList[i]['name'],quizzesList[i]['identifier'],quizzesList[i]['description'], duration);
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
	var bar = new ProgressBar('[:bar] :percent :etas', { total: 10 });
	var timer = setInterval(function () {
	  bar.tick();
	  if (bar.complete) {
	    console.log('\nImport completed\n');
	    clearInterval(timer);
	    if(foundQuiz){
			console.log("You have successfully imported the quiz (" + global.importedQuiz['name'] + ") ");
			global['processCommand']();
		}
		else{
			console.log("Unable to locate Quiz, Run listquizzes command to view available quizzes.");
			global['processCommand']();
		}
	  }
	}, 100);
	
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
		console.log("Questions");
		console.log("============");
		global.startTakingQuiz();
	}
}

global.download = function(){
	console.log("Called the download function");
	if(global.activeUserRole === 'admin'){
		//Perform download
	}
}

global.upload = function(){
	console.log("Called the upload function");
	if(global.activeUserRole === 'admin'){
		//Perform the upload
	}
}

global.clear = function(){
	util.print("\u001b[2J\u001b[0;0H");
}


global.startTakingQuiz = function(){
	var sNum = 1;
	for(var id in global.importedQuestions){

		console.log( "(" + sNum + ")" + " " + global.importedQuestions[id].body);
		for (var option in global.importedQuestions[id].options)
		{
			console.log( "\t(" + option + ") " + global.importedQuestions[id].options[option]);
		}
		console.log("\n");

		const inputQuizResponse = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
/*
		inputQuizResponse.question('Enter Answer? (exit or quit to end QuizApp) ', (userOption) => {
			if (userOption.toLowerCase() === 'exit' || userOption.toLowerCase() === 'quit'){
				inputQuizResponse.close();
			}
			else{
				userResponses[id] = userOption;
				//startTakingQuiz();
			}
		}); */
		sNum++;

		
	}

	
}

module.exports = {
	processCommands : processCommands,
	commandHelp : commandHelp,
	listquizzes : listquizzes,
	importquiz : importquiz,
	takequiz : takequiz,
	clear : clear
}