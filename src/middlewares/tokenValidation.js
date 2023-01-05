import { connection } from "../database/db.js";

export async function tokenValidation(req, res, next) {
	const token = req.headers.authorization?.replace("Bearer ", "");

	try {
		const query = await connection.query(
			"SELECT * FROM sessions WHERE token = $1",
			[token]
		);

		if (query.rows.length) {
			next();
		} else {
			res.sendStatus(401);
		}
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
