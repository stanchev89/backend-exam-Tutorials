module.exports = function(err, req, res, next) {
	let error;
	if (Array.isArray(err)) {
		error = err[0];
	} else {
		error = err;
	}
	if (res.locals.validationErrorViewName && error) {
		const errMsg = error.msg || err.message;
		console.error(errMsg);
		res.render(res.locals.validationErrorViewName, { message: errMsg, body: req.body });
		return;
	}
	console.error(error.message || error.msg || "Server Error");

	res.status(500).end(error);
};
