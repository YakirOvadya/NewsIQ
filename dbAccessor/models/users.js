// models/flight.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
});

const users = mongoose.model("users", userSchema);

module.exports = users;
