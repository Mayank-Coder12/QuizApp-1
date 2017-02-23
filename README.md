# **QuizApp** - Andela Week 2 Project
**QuizApp** is a command line Quiz Application

[![Build Status](https://travis-ci.org/ajudensi/SLC-Day-2.svg?branch=master)](https://travis-ci.org/anuonifade/QuizApp)
[![Code Climate](https://codeclimate.com/github/anuonifade/QuizApp/badges/gpa.svg)](https://codeclimate.com/github/anuonifade/QuizApp)
[![Issue Count](https://codeclimate.com/github/anuonifade/QuizApp/badges/issue_count.svg)](https://codeclimate.com/github/anuonifade/QuizApp)
[![codebeat badge](https://codebeat.co/badges/18819d86-c0f4-4962-a4a5-ae9cae85d88c)](https://codebeat.co/projects/github-com-anuonifade-quizapp)

## About **QuizApp**
**QuizApp** is a command line Quiz Application. It takes commands from users with or without argument and execute appropriately. User can take quiz offline or online. The default is offline. Listed below are the commands you can use in **QuizApp**.

## **QuizApp** Commands
<table>
	<tr>
		<td>`user`</td>
		<td> Used to create a user, it takes an argument `nickname` of the form `user mynickname`. If no user is created, **QuizApp** registers you as Anonymous</td>
	</tr>
	<tr>
		<td>`listquizzes`</td>
		<td> Lists all the available Quizzes in the QuizApp application. Does not take any additional argument.</td>
	</tr>
	<tr>
		<td>`importquiz <quiz_identifier>`</td>
		<td> Imports the identified quiz to the memory waiting to be taken</td>
	</tr>
	<tr>
		<td>`takequiz`</td>
		<td> Gets the imported Quiz ready to be taken. It does not take any argument.</td>
	</tr>
	<tr>
		<td>`start`</td>
		<td> Starts the Quiz. Only 5 questions are displayed at a time. You can navigate through the pages appropriately using the commands listed below.</td>
	</tr>
	<tr>
		<td>`prev` `next` `page <page_number>` `firstpage` `lastpage`</td>
		<td> `prev` takes you to the previous page if available. `next` takes you to the next page if available. `page <page_number>` takes you to the page number you indicated if available. `firstpage` takes you to the start of the page. `lastpage` takes you to the last page of the quiz.</td>
	</tr>
	<tr>
		<td>`question <number> <option>` or `q <number> <option>`</td>
		<td>To answer an active quiz question. You can use any of the command `question` or `q`. Both takes the same argument `<number>` the number of the question you are answering and `<option>` your choice from the list of available options. You can answer questions in any order and you can change your choice as many times as possible before you submit.</td>
	</tr>
	<tr>
		<td>`done`</td>
		<td> Used when you are done with answering your quiz. It submits you quiz, grade you and displays your result.</td>
	</tr>
	<tr>
		<td>`exit` or `quit`</td>
		<td> Used to close the application. If there is an ongoing test, it will ask if you really want to close the application as there is an ongoing quiz. If yes it closes and no will continue the quiz. The option is yes by default. If there is no ongoing test, the application automatically closes.</td>
	</tr>
	<tr>
		<td>`online` - *coming soon*</td>
		<td> Used to switch quiz from offline to online mode if the current mode is offline</td>
	</tr>
	<tr>
		<td>`offline` - *coming soon*</td>
		<td> Used to switch quiz from online to offline mode. This is the default mode.</td>
	</tr>
	<tr>
		<td>`help` or `?`</td>
		<td> Used to display the help documentation. When `?` is used in from of a command, it displays the help documentation for the command.</td>
	</tr>
</table>

## Run CLI App
```javascript
node app
```