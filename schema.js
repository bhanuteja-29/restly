import Joi from 'joi';

export const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().min(0).required(),
        image : Joi.string().allow("",null),
        location : Joi.string().required(),
        country : Joi.string().required(),
        categories: Joi.array().items(Joi.string()).default(["Hotels"])
    }).required()
});

export const reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
})
