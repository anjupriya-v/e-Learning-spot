const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "please mention your first name"],
  },
  lastName: {
    type: String,
    required: [true, "please mention your last name"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [8, "Minimum password length is 8"],
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  tasks: [
    {
      task: {
        type: String,
        required: true,
      },
      endDate: {
        type: String,
        required: true,
      },
      completed: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.statics.login = async function (email, password) {
  if (email === "") {
    throw Error("Email Not Provided");
  }
  if (password === "") {
    throw Error("Password Not Provided");
  }
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password");
  }
  throw Error("Incorrect Email");
};
const user = mongoose.model("account_information", userSchema);
module.exports = user;
