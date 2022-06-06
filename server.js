const express = require("express");

// to initialize the express app
const app = express();

// To create the server
const server = require("http").Server(app);

// This creates a websocket for real live comunication
const io = require("socket.io")(server);

const { v4: uuidv4 } = require("uuid");

// Import peerJs and set up a serve with it for peer-to-peer connection to be able to share audio and videos etc,
const {ExpressPeerServer} = require('peer');
const { debug } = require("console");
 
const peerServer = ExpressPeerServer(server, () => {
  debug: true 
})

// This sets the view engine, without which the app will not be able to identify the ejs file
app.set("view engine", "ejs");

// This specifies the path for our public folder
app.use(express.static("public"));

// Base url for peerJs server
app.use('/peerjs', peerServer)

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// ***NB: Without the colon(:) before the room after /, the url will not work.
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
}); 

io.on("connection", (socket) => {
  // This accepts the socket.emit('join-room') call that is done in the frontend script.js
  socket.on("join-room", (roomId, userId) => {
    // This now does the actual joining of the new user, using the user's roomId
    socket.join(roomId);

    // This then shows the new user in the frontend
    socket.broadcast.emit('user-connected', userId)

    /* Here we want the server to recieve the message and send it back to the frontend */

    socket.on('message', /* this text in quotes should match the one in the script.js */ message => {
      io.emit('createMessage', message)
      /* io.to(roomId).emit('createMessage', message) this will show the message in the specified */
    })
  });
});

// to get the server tlistenig to activities in a port
server.listen(3010, () => {
  console.log(`Successfully Connected To Server at Port: 3010`);
});
