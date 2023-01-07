import { connection } from "../database/db.js";

export async function searchUser(req, res) {
	const text = req.query?.text.trim();
	try {
		const query = await connection.query(
			`SELECT username, id, image FROM users WHERE LOWER (username) LIKE '%' || LOWER ($1) || '%'`,
			[text]
		);
		console.log(query.rows);
		res.status(200).send(query.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
