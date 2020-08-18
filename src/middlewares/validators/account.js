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

const topUpValidate = (req, res, next) => {
    const schema = Joi.object({
      amount: Joi.number().required().integer(),
      user: Joi.number().required().integer().min(0),
    });
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };

export{
  topUpValidate,
}