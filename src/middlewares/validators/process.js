import Joi from '@hapi/joi'

const validationObj = (messages) => Joi.string().trim().required().messages(messages);
const joiMessageFunction = (error, req, res, next) => {
  if (error) {
    const { details } = error;
    const message = {};
    details.forEach((d) => {
      message[d.context.key] = d.message;
    });
    return res.status(400).json({ status: 400, error: message });
  }
  return next();
};

const processValidate = (req, res, next) => {
    const schema = Joi.object({
      receiver: validationObj({ 'string.required': 'receiver is required', 'string.base': 'Invalid type, the receiver must be a string', 'string.empty': 'Please enter the receiver number' }),
      sender: validationObj({ 'string.required': 'sender is required', 'string.base': 'Invalid type, the sender must be a string', 'string.empty': 'Please enter the the name of the' }),
      amount: validationObj({ 'string.required': 'amount is required', 'string.base': 'Invalid type, the amount must be a string', 'string.empty': 'Please enter the amount to send' }),

    });
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };

export{
  processValidate,
}