import Joi from "joi";

export const createCourseValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
});