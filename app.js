'use strict'

let quiz = require('./files/quizzes.json');
let uuid = require('uuid/v1');
const commands = require('./require/functions');
const readline = require('readline');
const user = require('./files/users.json');

/*
const inputUser = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

*/
/**
* This part of the code takes in a users unique username of nickname. 
* If the username already exist in the user database, the user is assigned the current user
* If the user does not exist, the user is created and assigned the current user.
* A user can login as an admin user by using admin <username> <password>
* Using on admin as the command will request for the user's username and password
* Using admin <username> will prompt for the password and try to match the username to the password 
* In the admin list in the users database.
**/
/*
inputUser.question('Enter nickname/username to start quiz: ', (enteredUsername) => {
	let userFound = false;
	if(enteredUsername.split(" ")[0].toLowerCase() !== 'admin'){
		let users = user.users.regular;
		for(var i = 0; i < users.length; i++){
			if(users[i].identifiers === enteredUsername.toLowerCase()){
				global.activeUser = enteredUsername;
				global.activeUserID = users[i]._id;
				global.role = "regular";
				userFound = true;
				break;
			}
		}
		if (userFound == false){
			const userDetails = {};
			userDetails._id = uuid();
			userDetails.identifiers = enteredUsername;
			userDetails.createdAt = Math.floor(Date.now());
			userDetails.status = 1;
			users = JSON.parse(user.users);
			users['regular'].push(userDetails);
		}
	}
	else{
		let usersAdmin = user.users.admin;
		for( var j = 0; j < usersAdmin.length; j++){
			if(usersAdmin[i].identifiers === enteredUsername.toLowerCase()){
				global.activeUser = enteredUsername;
				global.activeUserID = usersAdmin[i]._id;
				global.role = "admin";
				userFound = true;
				break;
			}
		}
	}
	
});

*/

console.log("Welcome to QuizApp application");
console.log("===============================");
console.log("\n");
console.log(" To see the list of commands, type - help or ?");
console.log("\n");



/*** This part of the code starts taking the commands from the users
Users can enter various commands to be able to list quizzes, import quizzes and take quizzes
* listquizzes lists out all the available quizzes offline
* importquiz can import the specified quiz
* takequiz lets the user start taking the selected quiz
*/ 

const inputRead = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

global.processCommand = function(){
	inputRead.question('Enter command? (exit or quit to end QuizApp) ', (enteredCommand) => {
		if (enteredCommand.toLowerCase() === 'exit' || enteredCommand.toLowerCase() === 'quit'){
			inputRead.close();
		}
		else{
			commands.processCommands(enteredCommand);
			processCommand();
		}
		
	});
}

processCommand();
