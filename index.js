const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const firebase = require('firebase/app');
require('firebase/database');

// Your Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDfaw8Ksidq7p1dkwPc9bzZdieW4dU6kZI",
            authDomain: "chatbaby-45f8e.firebaseapp.com",
            projectId: "chatbaby-45f8e",
            storageBucket: "chatbaby-45f8e.appspot.com",
            messagingSenderId: "465748149094",
            appId: "465748149094",
            measurementId: "G-BP13SFGKCP" // Optional, remove this line if not used
        };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for new messages from the client
  socket.on('chat message', (message) => {
    console.log('Received message:', message);

    // Save the message to Firebase
    firebase.database().ref('messages').push({
      name: message.name,
      text: message.text,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
