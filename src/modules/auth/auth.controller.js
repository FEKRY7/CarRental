const userModel = require("../../../Database/models/User.model.js");
const tokenModel = require("../../../Database/models/token.model.js");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utils/httperespons.js");

const SignUp = async (req, res, next) => {
  const { userName, password, role } = req.body;

  try {
    // Check if the username already exists
    const isUserExist = await userModel.findOne({ userName });
    if (isUserExist) {
      return First(
        res,
        "Username already exists, please choose another one.",
        409,
        http.FAIL
      );
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 8);

    // Create new user
    const newUser = await userModel.create({
      userName,
      password: hashedPassword,
      role,
    });

    // Return success message

    return Second(
      res,
      ["User successfully registered", newUser],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const LogIn = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    // Check if user exists
    const isUserExist = await userModel.findOne({ userName });
    if (!isUserExist) return First(res, "Invalid Username", 401, http.FAIL);
    // Check if password matches
    const isPasswordMatch = await bcryptjs.compare(
      password,
      isUserExist.password
    );
    if (!isPasswordMatch) return First(res, "Invalid Password", 401, http.FAIL);

    // Create payload for JWT
    const payload = {
      id: isUserExist._id,
      userName: isUserExist.userName,
      isLoggedIn: isUserExist.isLoggedIn,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save the token (optional step)
    await tokenModel.create({ token, user: isUserExist._id });

    // Update isLoggedIn status
    isUserExist.isLoggedIn = true;
    await isUserExist.save();

    // Return token in response
    return Second(
      res,
      { message: "Login Successful", token: `Bearer ${token}` },
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const LogOut = async (req, res, next) => {
  try {
    // Find and update the user's isLoggedIn field to false
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { isLoggedIn: false },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return First(res, "User not found", 401, http.FAIL);
    }

    return Second(res, "Logged Out Successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const ChangePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Check if the old password is correct
    const isMatch = bcryptjs.compareSync(oldPassword, req.user.password);
    if (!isMatch) {
      return First(res, "Old Password Is Wrong", 400, http.FAIL);
    }

    // Hash the new password
    const hashedNewPassword = bcryptjs.hashSync(newPassword, 8);

    // Update the password
    await userModel.findByIdAndUpdate(req.user._id, {
      password: hashedNewPassword,
    });

    return Second(res, "Password Changed Successfully", 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  SignUp,
  LogIn,
  LogOut,
  ChangePassword,
};
