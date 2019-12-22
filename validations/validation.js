//VALIDATION
const Joi = require('@hapi/joi');

//Teacher Register Validation
const registerTeacherValidation = data => {
    const schema = Joi.object({
        name: Joi
            .string()
            .min(2)
            .max(30)
            .required(),
        surname: Joi
            .string()
            .min(2)
            .max(30),
        email: Joi
            .string()
            .min(6)
            .max(100)
            .required()
            .email(),
        university: Joi.string()
            .min(6)
            .max(200)
            .required(),
        password: Joi.string()
            .min(6)
            .max(30)
            .required(),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password')),
        userType: Joi.number()
            .min(0)
            .required()
    });
    return schema.validate(data);
};

//Student Register Validation
const registerStudentValidation = data => {
    const schema = Joi.object({
        name: Joi
            .string()
            .min(2)
            .max(30)
            .required(),
        surname: Joi
            .string()
            .min(2)
            .max(30),
        username: Joi.string()
            .min(2)
            .max(15)
            .required(),
        email: Joi
            .string()
            .min(6)
            .max(100)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .max(30)
            .required(),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password')),
        userType: Joi.number()
            .min(0)
            .required()
    });
    return schema.validate(data);
};


//Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

module.exports.registerTeacherValidation = registerTeacherValidation;
module.exports.registerStudentValidation = registerStudentValidation;
module.exports.loginValidation = loginValidation;