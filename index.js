const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const aboutOurCourses = require("./public/data/aboutOurCourses");
const courseTracks = require("./public/data/courseTracks");
const remarksData = require("./public/data/remarksData.js");
const states = require("./public/data/states");
const User = require("./models/user");
require("dotenv").config();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//database connection
app.use(cookieParser());
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database is not Connected");
  });
app.get("*", checkUser);
app.get("/", async (req, res) => {
  res.render("index", { aboutOurCourses, courseTracks, remarksData });
});
app.get("/task-manager", requireAuth, async (req, res) => {
  const { id } = req.user;
  var currentUser = await User.findById(id);
  var tasks = currentUser.tasks;
  res.render("./partials/taskManager", { tasks });
});
app.get("/create-task", requireAuth, (req, res) => {
  res.render("./partials/createTask");
});
app.get("/task-manager/delete/:id", requireAuth, async (req, res) => {
  const { id } = req.user;
  const currentUser = await User.findById(id);
  var tasks = currentUser.tasks;
  var taskId = req.params.id;
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1);
  await currentUser.save();
  res.redirect("/task-manager");
});
app.get("/task-manager/update/:id", requireAuth, async (req, res) => {
  const { id } = req.user;
  var currentUser = await User.findById(id);
  var tasks = currentUser.tasks;
  var taskId = req.params.id;
  tasks.map((task) => {
    if (task.id === taskId) {
      task.completed = "Completed";
    }
  });
  await currentUser.save();
  res.render("./partials/taskManager", { tasks });
});
app.post("/create-task", requireAuth, async (req, res) => {
  const { task, endDate } = req.body;
  const { id } = req.user;
  const currentUser = await User.findById(id);
  currentUser.tasks.push({
    task: task,
    endDate: endDate,
    completed: "In-Complete",
  });
  await currentUser.save();
  res.redirect("/task-manager");
});
const confirmStatement = "Profile Information updated";
app.get("/profile", requireAuth, (req, res) => {
  res.render("./partials/profile", { states, confirmStatement });
});
app.post("/profile", requireAuth, async (req, res) => {
  const { firstName, lastName, email, address, city, state, phoneNumber } =
    req.body;
  const user = await User.findOne({ email });
  user.firstName = firstName;
  user.lastName = lastName;
  user.city = city;
  user.address = address;
  user.state = state;
  user.phoneNumber = phoneNumber;
  await user.save();

  res.render("./partials/profile", { user, states, confirmStatement });
});
app.get("/software-development", requireAuth, (req, res) => {
  res.render("./partials/course", { courseTracks: courseTracks[0] });
});
app.get("/data-analytics", requireAuth, (req, res) => {
  res.render("./partials/course", { courseTracks: courseTracks[1] });
});
app.get("/marketing-and-sales", requireAuth, (req, res) => {
  res.render("./partials/course", { courseTracks: courseTracks[2] });
});
app.use(authRoutes);
app.listen(process.env.PORT || 3030, () => {
  console.log("your App is running on http://localhost:3030");
});
