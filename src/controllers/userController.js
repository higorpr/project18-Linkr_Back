import connection from "../database/db.js";
import urlMetadata from "url-metadata";

export async function getUserLinks(req, res) {
	const { id } = req.params;

	try {
		const user = (
			await connection.query(
				`
            SELECT * 
            FROM users 
            WHERE id = $1;
        `,
				[id]
			)
		).rows;

		if (user.length === 0) {
			return res.status(404).send("User not found!");
		}

		const posts = (
			await connection.query(
				`
            SELECT 
                posts.*,
                users.username as username,
                users.image as image,
                COUNT(liked_posts.user_id) as likes,
				($1=posts.user_id) as "ownPost",
                EXISTS (
                    SELECT 
                        true 
                    FROM liked_posts 
                    WHERE user_id=$1 
                    AND post_id=posts.id
                ) as "selfLike"
            FROM posts 
            LEFT JOIN users
            ON users.id=posts.user_id
            LEFT JOIN liked_posts
            ON posts.id=liked_posts.post_id
            WHERE posts.user_id = $1 
            GROUP BY posts.id, users.username, users.image, users.id
            ORDER BY created_at DESC 
            LIMIT 20;   
        `,
				[id]
			)
		).rows;

		let i;

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
				function (error) {}
			);
		}

		res.status(200).send(posts);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
