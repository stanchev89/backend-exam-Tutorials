const mongoose = require("mongoose");
const types = mongoose.Schema.Types;
const courseSchema = new mongoose.Schema({
	title: {
		type: types.String,
		required: true,
		unique: true
	},
	description: {
		type: types.String,
		required: true,
		maxlength: 50
	},
	imageUrl: {
		type: types.String,
		required: true
	},
	createdAt: {
		type: types.Date || types.String,
		requried: true
	},
	duration: {
		type: types.String,
		required: true
	},
	creatorId: {
		type: types.ObjectId,
		ref: "user"
	},
	enrolls: [ { type: types.ObjectId, ref: "user" } ]
});
module.exports = mongoose.model("course", courseSchema);
