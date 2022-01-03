const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      userRole: req.body.userRole,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "This email already has an account! Please log in.",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user || req.body.userRole !== user.userRole) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed!",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          userRole: fetchedUser.userRole,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        message: "Auth success!",
        expiresIn: 3600,
        userRole: fetchedUser.userRole,
        userId: fetchedUser._id,
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Invalide authentication credentials!",
      });
    });
};

exports.usersFetch = (req, res, next) => {
  User.find()
    .then((users) => {
      //console.log(users);
      return res.status(200).json({
        users: users,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching users failed!",
      });
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id }).then((result) => {
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized!" });
    }
  });
};
