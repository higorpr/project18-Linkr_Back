import joi from "joi";

export const commentSchema = joi.object({
	post_id: joi.number().required(),
	text: joi.string().min(1).required(),
});