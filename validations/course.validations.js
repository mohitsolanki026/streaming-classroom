import Joi from "joi";

export const createCourseValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    clientId: Joi.string().required(),
    generalLinks: Joi.array().items(Joi.string())
});