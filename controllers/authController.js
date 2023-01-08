const user = require("../models/user");
const jwt = require("jsonwebtoken");
const handleErrors = (err) => {
  let errorsList = { firstName: "", lastName: "", email: "", password: "" };
  if (err.code === 11000) {
    errorsList.email = "This Email is already registered";
    return errorsList;
  }
  if (err.message === "Incorrect Email") {
    errorsList.email = "This email is not registered";
  }
  if (err.message === "Email Not Provided") {
    errorsList.email = "Please enter the email";
  }
  if (err.message === "Password Not Provided") {
    errorsList.password = "Please enter the password";
  }
  if (err.message === "Incorrect Password") {
    errorsList.password = "This password is incorrect";
  }
  if (err.message.includes("account_information")) {
    Object.values(err.errors).map((error) => {
      errorsList[error.properties.path] = error.properties.message;
    });
  }
  return errorsList;
};
const createToken = (id) => {
  return jwt.sign({ id }, process.env.HEADER, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
signup_get = (req, res) => {
  res.render("./partials/signup");
};
login_get = (req, res) => {
  res.render("./partials/login");
};
signup_post = async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userData = await user.create({
      firstName,
      lastName,
      email,
      password,
    });
    const token = createToken(userData._id);
    res.cookie("jwt", token, { secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ userData: userData._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
login_post = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userData = await user.login(email, password);
    const token = createToken(userData._id);
    res.cookie("jwt", token, { secure: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ userData: userData._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
module.exports = { signup_get, login_get, signup_post, login_post, logout_get };
