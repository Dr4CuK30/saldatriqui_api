const { Schema, model } = require('mongoose');

const UserSchema = Schema({
	usuario: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	friends: {
		type: Array,
		required: true,
	},
	max_score: {
		type: Number,
		required: false,
	},
});

UserSchema.methods.toJSON = function () {
	const { password, __v, _id, ...user } = this.toObject();
	user.uid = _id;
	return user;
};

module.exports = model('User', UserSchema);
