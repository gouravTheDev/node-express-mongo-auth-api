const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const { check, validationResult } = require("express-validator");

//Signin Controller
exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match"
      });
    }

    else if (user.status == "Inactive" || user.deleted) {
      return res.status(400).json({
        error: "User Account is not active"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

//regiter Controller
exports.register = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }else{
    User.findOne({ email: req.body.email })
    .exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email already exists."
        });
      }else{
        const user = new User(req.body);
        user.save((err, user) => {
          if (err) {
            return res.status(400).json({
              err: "not able to save user in DB"
            });
          }
          res.json({
            message: "User registered successfully! Please login to continue."
          });
        });
      }
    });
  }
};

// Signout controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

// Authentication middleware
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});

