import Joi from '@hapi/joi'

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

const rateValidate = (req, res, next) => {
    const schema = Joi.object({
        currency: Joi.number().required().min(0),
        companyFees: Joi.number().required().min(0),
        agentFees: Joi.number().required().min(0),

    });
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };

export{
    rateValidate,
}