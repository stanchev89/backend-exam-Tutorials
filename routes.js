const { courseController, userController } = require("./controllers");
const validate = require("./validators");
const mustBeLoggedInAndAuthor = require("./middlewares/setAuthView");
module.exports = (app) => {
	app.get("/", courseController.get.all);
	app.get("/register", mustBeLoggedInAndAuthor(false), userController.get.register);
	app.get("/login", mustBeLoggedInAndAuthor(false), userController.get.login);
	app.get("/logout", mustBeLoggedInAndAuthor(true), userController.get.logout);
	app.post(
		"/register",
		mustBeLoggedInAndAuthor(false),
		validate.setValidationErrorViewName("register"),
		validate.checkForEmptyFields("username", "password", "repeatPassword"),
		validate.checkMinLength(5, "username", "password"),
		validate.onlyEnglishAndNumbers("username", "password"),
		validate.checkUsernameExisting,
		validate.repeatPasswordCheck,
		validate.handleValidationErrors,
		userController.post.register
	);
	app.post(
		"/login",
		mustBeLoggedInAndAuthor(false),
		validate.setValidationErrorViewName("login"),
		validate.checkForEmptyFields("username", "password"),
		validate.onlyEnglishAndNumbers("username", "password"),
		validate.checkMinLength(5, "username", "password"),
		validate.handleValidationErrors,
		userController.post.login
	);

	app.get("/create", mustBeLoggedInAndAuthor(true), courseController.get.create);
	app.get("/details/:id", mustBeLoggedInAndAuthor(true), courseController.get.details);
	app.get("/edit/:id", mustBeLoggedInAndAuthor(true, true), courseController.get.edit);
	app.get("/delete/:id", mustBeLoggedInAndAuthor(true, true), courseController.get.delete);
	app.get("/enroll/:id", mustBeLoggedInAndAuthor(true, false), courseController.get.enroll);

	app.post(
		"/create",
		mustBeLoggedInAndAuthor(true),
		validate.setValidationErrorViewName("create"),
		validate.checkForEmptyFields("title", "description", "imageUrl", "duration"),
		validate.checkMinLength(4, "title"),
		validate.startsWithHttpOrHttps,
		validate.checkMinLength(20, "description"),
		validate.handleValidationErrors,
		courseController.post.create
	);
	app.post(
		"/edit/:id",
		mustBeLoggedInAndAuthor(true, true),
		validate.setValidationErrorViewName("edit"),
		validate.checkForEmptyFields("title", "description", "imageUrl", "duration"),
		validate.checkMinLength(4, "title"),
		validate.startsWithHttpOrHttps,
		validate.checkMinLength(20, "description"),
		validate.handleValidationErrors,
		courseController.post.edit
	);
};
