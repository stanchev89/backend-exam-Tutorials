const jwt = require("jsonwebtoken");
const { server: { jwtSecret, cookieName } } = require("../config");

const auth = function(req, res, next) {
	const token = req.cookies[cookieName];
	if (!token) {
		next();
		return;
	}
	jwt.verify(token, jwtSecret, (err, decoded) => {
		if (err) {
			next(err);
			return;
		}
		req.user = { _id: decoded.userId };
		res.locals.loggedIn = !!req.user;
		res.locals.username = decoded.username;
		next();
	});
};
module.exports = auth;
