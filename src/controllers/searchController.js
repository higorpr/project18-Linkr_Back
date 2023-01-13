import connection from "../database/db.js";

export async function searchUser(req, res) {
	const userId = res.locals.userId;
	const text = req.query?.text.trim();
	try {
		const query = await connection.query(
			`SELECT 
				u.username, 
				u.id, 
				u.image,
				EXISTS (
					SELECT 
						true 
					FROM follows 
					WHERE follower_id=$2
					AND followed_id=u.id
				) as "following"
			FROM users u
			WHERE LOWER (username) LIKE '%' || LOWER ($1) || '%' 
			ORDER BY "following" DESC
			LIMIT 10
			`,
			[text, userId]
		);
		res.status(200).send(query.rows);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
