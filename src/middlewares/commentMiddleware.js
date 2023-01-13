import { commentSchema } from "../models/commentSchema.js";

export async function commentValidation(req, res, next) {
	const comment = req.body;
	const validationErrors = commentSchema.validate(comment, {
		abortEarly: false,
	}).error;

	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	} else{
        comment.text = comment.text.trim();
        res.locals.comment = comment;
    }
	next();
}