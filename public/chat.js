$(function() {
	var socket = io.connect('http://localhost:3000')

	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	// Emit Message
	send_message.click(function () {
		socket.emit('new_message', {message: message.val()})
	})

	// Listen on new_message
	socket.on("new_message", (data) => {
		console.log(data)
		chatroom.append("<p class='message' >" + data.username + ": " + data.message + "</p>")
	})

	// Emit a username
	send_username.click(function() {
		console.log(username.val())
		socket.emit('change_username', {username: username.val()})
	})

	// emit typing
	message.bind("keypress", () => {
	  socket.emit('typing')
	})

	// socket on typing
	socket.on('typing', (data) => {
	  console.log(data)
	  feedback.html("<p><i>" + data.username + "is typing message" + "</i></p>")
	})
});

