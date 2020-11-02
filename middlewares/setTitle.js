module.exports = (req, res, next) => {
	const url = req.url.split("/")[1] || "home";
	const title = url.slice(0, 1).toUpperCase() + url.slice(1).toLowerCase();
	res.locals.title = title;
	next();
};
