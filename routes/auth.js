var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { register, signin, signout } = require("../controllers/auth");

router.post(
  "/register",
  [
    check("firstName", "First name should be at least 4 char").isLength({ min: 4 }),
    check("lastName", "Last name should be at least 4 char").isLength({ min: 4 }),
    check("email", "email is required").isEmail(),
    check("phone", "Please provide a valid number").isLength({ min: 10 }),
    check("address", "Address is required").isLength({ min: 1 }),
    check("state", "State is required").isLength({ min: 1 }),
    check("city", "City is required").isLength({ min: 1 }),
    check("country", "Country is required").isLength({ min: 1 }),
    check("dob", "DOB is required").isLength({ min: 1 }),
    check("password", "Password should be at least 4 char").isLength({ min: 4 })
  ],
  register
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 4 })
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
