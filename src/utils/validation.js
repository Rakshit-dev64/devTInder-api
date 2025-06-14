const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, gender } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Weak Password");
  } else if (!["male", "female", "others"].includes(gender)) {
    throw new Error("Gender Data is not valid");
  }
};
const validateLoginData = (req) => {
  const { emailId, password } = req.body;
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Address");
  } else if (!password) {
    throw new Error("Password is requuired");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "password",
    "gender",
    "photoUrl",
    "age",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};
module.exports = {
  validateSignupData,
  validateLoginData,
  validateEditProfileData
};
