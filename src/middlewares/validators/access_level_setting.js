
import Joi from '@hapi/joi'

const validationObj = (messages) => Joi.string().trim().optional().messages(messages);
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

const schema = Joi.object({
    tableName: validationObj({'string.base': 'Invalid type, your first name must be a string'}),
    tableAccessGroups: Joi.array().items(Joi.number().integer()),
    tableAccessMode: validationObj({'string.base': 'Invalid type, your other name must be a string'}),
    recordAccessGroups: Joi.array().items(Joi.number().integer()),
    recordAccessMode: validationObj({'string.base': 'Invalid type, your photo adress must be a string'}),
});


const validateAcceeSettings = (req, res, next) => {
    if (!Object.keys(req.body).length)
        return res.status(400).send({"error":'Data should be provided'})
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };


export default validateAcceeSettings

