import express from "express";
// const bodyParser = require("body-parser");
// import cors from "cors";
const cors = require("cors");
// import morgan from "morgan";
const morgan = require("morgan");

// initializations
const app = express();

const corsOptions = {
	origin: "http://localhost:8080",
};

// settings
app.set("port", process.env.PORT || 8080);

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions));
// app.use(bodyParser.json);

// Global Variables

// app.use((req, res, next) => {
// 	next();
// });

// Routes
app.use(require("./routes"));

// Public

// Starting the server
app.listen(app.get("port"), () => {
	console.log("Server listening on port", app.get("port"));
});
