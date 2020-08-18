
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
    firstName: validationObj({'string.base': 'Invalid type, your first name must be a string'}),
    familyName: validationObj({'string.base': 'Invalid type, your family name must be a string'}),
    otherName: validationObj({'string.base': 'Invalid type, your other name must be a string'}),
    profilePic: validationObj({'string.base': 'Invalid type, your photo adress must be a string'}),
    credential_id: validationObj({'integer.base': 'Invalid Profile, Id not a number?'}),
    medical_insurance: validationObj({'string.base': 'Invalid type, your username must be a string'}),
    email: validationObj({'string.base': 'Invalid email type'}).email(),
});


const validateProfile = (req, res, next) => {
    if (!Object.keys(req.body).length)
        return res.status(400).send({"error":'Data should be provided'})
    const { error } = schema.validate(req.body, {
      abortEarly: false
    });
    return joiMessageFunction(error, req, res, next);
  };


export{
    validateProfile,
}

