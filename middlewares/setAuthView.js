const { cookieName } = require("../config").server;
const courseModel = require("../models/course");
module.exports = function(mustBeLoggedIn, mustBeAuthor) {
	return async (req, res, next) => {
		const token = req.cookies[cookieName];
		if (mustBeLoggedIn && !token) {
			res.redirect("/login");
			return;
		} else if (!mustBeLoggedIn && token) {
			res.redirect("/");
			return;
		} else if (mustBeAuthor) {
			const course = await courseModel.findById(req.params.id).lean();
			if (course.creatorId.toString() === req.user._id) {
				next();
				return;
			}
			res.redirect(`/details/${req.params.id}`);
			return;
		} else {
			next();
		}
	};
};
