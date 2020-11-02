const { body, validationResult } = require("express-validator");
const userModel = require("../models/user");

function checkForEmptyFields(...fields) {
	return body(fields.length === 1 ? fields[0] : fields, "All fields are required!").exists().notEmpty();
}

function checkMaxLength(max, ...fields) {
	return body(
		fields.length === 1 ? fields[0] : fields,
		`Max length: ${max} symbols for: ${fields.join(",")}!`
	).isLength({
		max
	});
}
function checkMinLength(min, ...fields) {
	return body(
		fields.length === 1 ? fields[0] : fields,
		`Min length: ${min} symbols for: ${fields.join(",")}!`
	).isLength({
		min
	});
}
function onlyEnglishAndNumbers(...fields) {
	return body(
		fields.length === 1 ? fields[0] : fields,
		`Only english letters and numbers required for: ${fields.join(",")}!`
	).matches(/^[A-Za-z0-9]+$/);
}
const startsWithHttpOrHttps = body("imageUrl", `Image Url must starts with http or https !`).matches(/https?/);

const repeatPasswordCheck = body("repeatPassword", "Passwords don't match!").custom((value, { req }) => {
	if (value !== req.body.password) {
		return Promise.reject("Passwords don't match!");
	}
	return true;
});

const checkUsernameExisting = body("username", "Username already in use!").custom(async (value, { req, next }) => {
	const user = await userModel.findOne({ username: value });
	if (user) {
		return Promise.reject("Username already in use!");
	}
	return true;
});

function handleValidationErrors(req, res, next) {
	const validationRes = validationResult(req);
	if (!validationRes.isEmpty()) {
		next(validationRes.errors);
		return;
	}
	next();
}

function setValidationErrorViewName(viewName) {
	return function(req, res, next) {
		res.locals.validationErrorViewName = viewName;
		next();
	};
}

module.exports = {
	checkForEmptyFields,
	checkMaxLength,
	checkMinLength,
	onlyEnglishAndNumbers,
	startsWithHttpOrHttps,
	repeatPasswordCheck,
	checkUsernameExisting,
	handleValidationErrors,
	setValidationErrorViewName
};
