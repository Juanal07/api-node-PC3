import express from "express";
import cors from "cors";
import morgan from "morgan";

// Initializations
const app = express();

// Settings
app.set("port", process.env.PORT || 8080);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Global Variables

// Routes
app.use(require("./routes"));

// Public

// Starting the server
app.listen(app.get("port"), () => {
	console.log("Server listening on port", app.get("port"));
});
