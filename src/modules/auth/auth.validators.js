const Joi = require('joi');

const signUp = Joi.object({
  userName: Joi.string()
    .min(2)
    .max(25)
    .required()
    .messages({
      'string.base': `Username should be a type of 'text'`,
      'string.empty': `Username cannot be an empty field`,
      'string.min': `Username should have a minimum length of {#limit}`,
      'string.max': `Username should have a maximum length of {#limit}`,
      'any.required': `Username is a required field`
    }),
  password: Joi.string()
    .min(6)
    .max(25)
    .required()
    .messages({
      'string.base': `Password should be a type of 'text'`,
      'string.empty': `Password cannot be an empty field`,
      'string.min': `Password should have a minimum length of {#limit}`,
      'string.max': `Password should have a maximum length of {#limit}`,
      'any.required': `Password is a required field`
    })
}).required();

const logIn = Joi.object({
  userName: Joi.string().required().messages({
    'any.required': `Username is required`,
    'string.empty': `Username cannot be empty`
  }),
  password: Joi.string().required().messages({
    'any.required': `Password is required`,
    'string.empty': `Password cannot be empty`
  })
}).required();

const changePassword = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': `Old password is required`
  }),
  newPassword: Joi.string().min(6).required().messages({
    'any.required': `New password is required`,
    'string.min': `New password should have a minimum length of {#limit}`
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    'any.only': `Confirm password must match the new password`,
    'any.required': `Confirm password is required`
  })
}).required();

module.exports = {
  signUp,
  logIn,
  changePassword
};
