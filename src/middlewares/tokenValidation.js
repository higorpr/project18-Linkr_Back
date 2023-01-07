import { getIdFromToken } from "../repositories/authRepository.js";

export async function tokenValidation(req, res, next) {
	const { authorization } = req.headers;
	const token = authorization?.replace("Bearer ", "");

	if (!token) {
		return res.sendStatus(400);
	}

	try {
		const userResponse = await getIdFromToken(token);
		if (userResponse.rows.length === 0) {
			return res.sendStatus(401);
		}
		const userId = userResponse.rows[0].user_id;
		res.locals.userId = userId;
	} catch (err) {
		console.log(err.message);
		return res.sendStatus(500);
	}

	next();
}
