global.__basedir = __dirname;
const { server, database } = require("./config");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const handlebars = require("express-handlebars");
const setCookie = require("./middlewares/setCookie");
const setTitle = require("./middlewares/setTitle");
const globalErrorHandler = require("./global-error-handler");

app.use(express.static(path.join(__basedir, "static")));
app.engine(
	".hbs",
	handlebars({
		extname: ".hbs"
	})
);
app.set("view engine", ".hbs");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(setTitle);
app.use(setCookie);
require("./routes")(app);

//must be last
app.use(globalErrorHandler);

mongoose
	// .connect("mongodb+srv://cluster0.qyezc.gcp.mongodb.net/<tutorials>", {
	.connect(`${database.connectionString}${database.databaseName}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	})
	.catch((err) => console.log(err))
	.then((data) => {
		console.log(`Connected to database successfully!`);
		return data;
	})
	.then(() => {
		app.listen(server.port, console.log(`Listening on port ${server.port}! Now its up to you...`));
	})
	.catch((err) => console.log(err));
