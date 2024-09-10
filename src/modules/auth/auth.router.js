const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/authentication.middeleware.js");
const isAuthorized = require("../../middleware/authoriztion.middelware.js");
const { validation } = require("../../middleware/validation.middleware.js");

const { signUp,logIn,changePassword } = require("./auth.validators.js");

const {
  SignUp,
  LogIn,
  LogOut,
  ChangePassword
} = require("./auth.controller.js");

router.post(
  "/signup",
  isAuthenticated,
  isAuthorized("SuperAdmin"),
  SignUp,
  validation(signUp)
);

router.post("/login", LogIn, validation(logIn));

router.post(
  "/logout",
  isAuthenticated,
  isAuthorized("Admin","SuperAdmin"),
  LogOut
);

router.post(
  "/changepassword",
  isAuthenticated,
  isAuthorized("Admin","SuperAdmin"),
  ChangePassword,
  validation(changePassword)
);

module.exports = router;
