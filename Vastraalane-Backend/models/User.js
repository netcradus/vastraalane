
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    mobile: { type: String, default: "" },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    gender: { type: String, default: "" },
    dob: { type: String, default: "" },
    location: { type: String, default: "" },
    altMobile: { type: String, default: "" },
    hintName: { type: String, default: "" },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
