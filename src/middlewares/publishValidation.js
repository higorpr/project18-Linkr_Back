import joi from "joi";

const linkSchema = joi.object({
    link: joi.string().uri().regex(/^(http|https):\/\//).required(),
    text: joi.string().min(0)
})

export function linkValidation (req, res, next){
    const obj = req.body;

    const validationError = linkSchema.validate(obj, {
        abortEarly: false,
    }).error;

    if(validationError){
        const error = validationError.details.map((e) => e.message);
        return res.status(422).send(error);
    }

    next();
}