const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	kakaoId:     { type: String, required: true },
	username:    { type: String, required: true },
	email:       { type: String, required: true, unique: true },
	nickname:    { type: String, required: true, unique: true },
	password:    { type: String, required: true },
	phone:       { type: String, required: true, unique: true },
	age:         { type: Number, required: true },
	bloodType:   { type: String, required: true },
	imageUrl: {
		type: String,
		default: "public/uploads/heart.png",
	},
	startedDate: { type: Date  , required: true },
	birthday:    { type: Date  , required: true },
	connectCode: { type: String, required: true },
	partnerNickname: { type: String, dafault: null },
	partnerId:   { type: String, default: null },
	createdAt:   { type: Date  , default: Date.now, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
