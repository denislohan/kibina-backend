import Joi from '@hapi/joi'

const validationObj = (messages) => Joi.string().trim().required().messages(messages);
const joiMessageFunction = (error, req, res, next) => {
  if (error) {
    const { details } = error;
    const message = {};
    details.forEach((d) => {
      message[d.context.key] = d.message;
    });
    return res.json({ status: 400, error: message });
  }
  return next();
};

const signupValidate = (req, res, next) => {
    const schema = Joi.object({
      username: validationObj({ 'string.required': 'Username is required', 'string.base': 'Invalid type, your username must be a string', 'string.empty': 'Please enter your username' }),
      firstName: validationObj({ 'string.required': 'First Name is required', 'string.base': 'Invalid type, your first name must be a string', 'string.empty': 'Please enter your first name' }),
      familyName: validationObj({ 'string.required': 'Family Name is required', 'string.base': 'Invalid type, your family name must be a string', 'string.empty': 'Please enter your family name' }),
      password: validationObj({ 'string.base': 'Invalid type, your password must be a string', 'string.min': 'password must be at least 8 characters long', 'string.empty': 'Please enter your password'}).min(8).alphanum().max(50),
    });
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };

  const signinValidate = (req, res, next) => {
    const schema = Joi.object({
      username: validationObj({ 'string.base': 'Invalid type, your email must be a string', 'string.empty': 'Please enter your email', 'string.email': 'Your email is invalid, please enter a valid email' }),
      password: validationObj({ 'string.base': 'Invalid type, your password must be a string', 'string.min': 'password must be at least 8 characters long', 'string.empty': 'Please enter your password' }).min(8).alphanum().max(50),
    });
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };

export{
  signupValidate,
  signinValidate
}