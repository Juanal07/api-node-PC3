import express from "express";
import cors from "cors";
import morgan from "morgan";

// initializations
const app = express();

// settings
app.set("port", process.env.PORT || 8080);

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

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
