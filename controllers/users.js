const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const config = require("../config").server;

module.exports = {
	get: {
		login(req, res, next) {
			res.render("login");
		},
		register(req, res, next) {
			res.render("register");
		},
		logout(req, res, next) {
			const jwtToken = res.cookie(config.cookieName);
			if (!jwtToken) {
				res.redirect("/");
				return;
			}
			res.clearCookie(config.cookieName);
			res.redirect("/");
		}
	},
	post: {
		login(req, res, next) {
			const { username, password } = req.body;
			userModel
				.findOne({ username })
				.then((user) => Promise.all([ user, user ? user.checkPass(password) : false ]))
				.then(([ user, match ]) => {
					if (!match) {
						res.render("login", { message: "Wrong username or password", body: req.body });
						return;
					}
					jwt.sign({ userId: user._id, username }, config.jwtSecret, function(err, jwtToken) {
						if (err) {
							next(err);
							return;
						}
						res.cookie(config.cookieName, jwtToken, { httpOnly: true });
						res.redirect("/");
					});
				});
		},
		async register(req, res, next) {
			const { username, password } = req.body;
			try {
				await userModel.create({ username, password });
				userModel
					.findOne({ username })
					.then((user) => Promise.all([ user, user ? user.checkPass(password) : false ]))
					.then(([ user, match ]) => {
						if (!match) {
							res.render("login", { message: "Wrong username or password", body: req.body });
							return;
						}
						jwt.sign({ userId: user._id, username }, config.jwtSecret, function(err, jwtToken) {
							if (err) {
								next(err);
								return;
							}
							res.cookie(config.cookieName, jwtToken, { httpOnly: true });
							res.redirect("/");
						});
					});
			} catch (err) {
				next(err);
			}
		}
	}
};
