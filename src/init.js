require("dotenv").config();
require("./db");

// Databases
const User = require("./models/User");

const app = require("./server");

const onListening = () => console.log(`Listening on: http://localhost:${process.env.PORT}`);

const onError = (error) => console.log(`Error: ${error}`);
const server = app.listen(process.env.PORT);

server.on("error", onError);
server.on("listening", onListening);