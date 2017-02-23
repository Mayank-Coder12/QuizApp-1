'use strict'

let quiz = require('./files/quizzes.json');
let uuid = require('uuid/v1');
var commands = require('./require/functions');
const inputRead = require('readline-sync');
const user = require('./files/users.json');
var colors = require('colors/safe');

console.log("\n");
console.log("                                   Welcome to QuizApp application".toUpperCase().underline.red);
console.log("=============================================================================================================".green);
console.log("To begin a quiz, use the command - listquizzes to see the list of Quiz available".bold.yellow);
console.log("To take online quiz, use the command - online to switch to online mode before use the command - listquizzes".bold.yellow);
console.log("To see the list of commands, type - help or ?".bold.yellow);
console.log("=============================================================================================================".green);
console.log("\n");

/*** This part of the code starts taking the commands from the users
*Users can enter various commands to be able to list quizzes, import quizzes and take quizzes
* listquizzes lists out all the available quizzes offline
* importquiz can import the specified quiz
* takequiz lets the user start taking the selected quiz
*/ 

global.processCommand = function(){

	var enteredCommand = inputRead.question('Enter command? (exit or quit to end QuizApp): ');
	if (enteredCommand.toLowerCase() === 'exit' || enteredCommand.toLowerCase() === 'quit'){
		if(global.userResponses == null || global.userResponses == undefined){
			process.exit();	
		}
		else{
			var responseExit = '';
			do{
				var responseYesNo = inputRead.question("You have an ongoing Quiz. Do you still want to close QuizApp?(y | n)".green);
				responseExit = responseYesNo.toLowerCase() || 'y';	
				if(responseExit == 'y'){
					global.done();
					process.exit();
				}
				else if(responseExit == 'n'){
					processCommand();
				}
				else{
					console.log("Incorrect response. Enter y | n");
				}
			}while(responseExit !== 'y' || responseExit !== 'n');
		}
	}
	else{
		commands.processCommands(enteredCommand);
		processCommand();
	}
}

processCommand();
