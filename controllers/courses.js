const courseModel = require("../models/course");
const userModel = require("../models/user");
module.exports = {
	get: {
		all(req, res, next) {
			const { search } = req.query;
			let query = {};
			if (search) {
				query.title = new RegExp(search, "i");
			}
			const sortCriteria = res.locals.loggedIn ? "createdAt" : null;
			const criteria = sortCriteria ? { [sortCriteria]: "asc" } : { enrolls: "desc" };
			courseModel
				.find(query)
				.populate("users")
				.sort(criteria)
				.lean()
				.then((data) => {
					let courses = res.locals.loggedIn ? data : data.sort((a, b) => b.enrolls.length - a.enrolls.length);
					if (!res.locals.loggedIn) {
						if (courses.length > 3) {
							courses = courses.slice(0, 3);
						}
						for (const course of courses) {
							course.enrolls = course.enrolls.length;
						}
					}
					const options = { weekday: "short", month: "short", day: "numeric", hours: "short" };
					for (const course of courses) {
						console.log(course.createdAt.toLocaleDateString(undefined, options));
					}
					res.render("index", { courses, search });
				})
				.catch(next);
		},
		create(req, res, next) {
			res.render("create");
		},
		edit(req, res, next) {
			const id = req.params.id;
			courseModel
				.findById(id)
				.populate("users")
				.lean()
				.then((course) => {
					res.render("edit", { course });
				})
				.catch(next);
		},
		details(req, res, next) {
			const id = req.params.id;
			courseModel
				.findById(id)
				.populate("users")
				.lean()
				.then((course) => {
					let isAuthor;
					let isEnrolled;
					if (course.creatorId.toString() === req.user._id) {
						isAuthor = true;
					}
					course.enrolls.forEach((enroledId) => {
						if (enroledId.toString() === req.user._id) {
							isEnrolled = true;
						}
					});
					res.render("details", { course, isAuthor, isEnrolled });
				})
				.catch(next);
		},
		enroll(req, res, next) {
			const id = req.params.id;
			courseModel
				.findById(id)
				.populate("users")
				.then((course) => {
					let alreadyEnrolledByUser = false;
					course.enrolls.forEach((enroll) => {
						if (enroll.toString() === req.user._id) {
							alreadyEnrolledByUser = true;
						}
					});
					if (course.creatorId.toString() === req.user._id) {
						alreadyEnrolledByUser = true;
					}
					if (alreadyEnrolledByUser) {
						res.redirect(`/details/${id}`);
						return;
					}
					course.enrolls.push(req.user._id);
					course.save();
					userModel
						.findById(req.user._id)
						.populate("courses")
						.then((user) => {
							let alreadyEnrolled = false;
							user.enrolled.forEach((e) => {
								if (e._id.toString() === id) {
									alreadyEnrolled = true;
								}
							});
							if (!alreadyEnrolled) {
								user.enrolled.push(id);
							}
							user.save();
						})
						.catch(next);

					res.redirect(`/details/${id}`);
				})
				.catch(next);
		},
		delete(req, res, next) {
			const id = req.params.id;
			courseModel.findByIdAndRemove(id, function(err, result) {
				if (err) {
					next(err);
					return;
				}
				res.redirect("/");
			});
		}
	},
	post: {
		create(req, res, next) {
			const { title, description, imageUrl, duration } = req.body;
			const creatorId = req.user._id;
			const newCourse = { title, description, imageUrl, duration, createdAt: Date.now(), creatorId };
			courseModel
				.create(newCourse)
				.then(() => {
					res.redirect("/");
				})
				.catch(next);
		},
		edit(req, res, next) {
			const id = req.params.id;
			const { title, description, imageUrl, duration } = req.body;
			courseModel
				.findByIdAndUpdate(id, { $set: { title, description, imageUrl, duration } }, function(err, doc) {
					if (err) {
						next(err);
					}
					res.redirect(`/details/${id}`);
				})
				.catch(next);
		}
	}
};
