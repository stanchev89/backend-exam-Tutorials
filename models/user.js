const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { server } = require("../config");
const types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
	username: {
		type: types.String,
		required: true,
		unique: true,
		minlength: [ 5, "Minimum 5 characters required!" ]
	},
	password: {
		type: types.String,
		required: true,
		minlength: [ 5, "Minimum 5 characters required!" ]
	},
	enrolled: [ { type: types.ObjectId, ref: "courses" } ]
});
userSchema.pre("save", function(done) {
	const user = this;
	if (!user.isModified("password")) {
		done();
		return;
	}
	bcrypt.genSalt(server.salt, (err, salt) => {
		if (err) {
			done(err);
			return;
		}
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) {
				done(err);
				return;
			}
			user.password = hash;
			done();
		});
	});
});

userSchema.methods.checkPass = function(providedPassword) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(providedPassword, this.password, function(err, result) {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
};
module.exports = mongoose.model("user", userSchema);
