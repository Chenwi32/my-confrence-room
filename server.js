const express = require("express");

// to initialize the express app
const app = express();

// To create the server
const server = require("http").Server(app);

const { v4: uuidv4 } = require("uuid");

// This sets the view engine, without which the app will not be able to identify the ejs file
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// ***NB: Without the colon(:) before the room after /, the url will not work.
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

// to get the server tlistenig to activities in a port
server.listen(3010);
