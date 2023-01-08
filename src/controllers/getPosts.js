import  connection  from "../database/db.js";
import urlMetadata from "url-metadata";

export async function getPosts(req, res) {
	try {
		const query = await connection.query(
			`SELECT 
                posts.*,
                users.username as username,
                users.image as image 
            FROM posts 
            JOIN users
            ON users.id=posts.user_id
            ORDER BY created_at DESC 
            LIMIT 20 `
		);
		let i = 0;
		const posts = query.rows;

		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].link).then(
				function (metadata) {
					posts[i] = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i],
					};
				},
				function (error) {
					console.log(error);
				}
			);
		}

		res.status(200).send(posts);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
