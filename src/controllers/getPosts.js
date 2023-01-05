import connection from "../database/db.js";
import urlMetadata from "url-metadata";

async () => {
	await urlMetadata(
		"https://g1.globo.com/ciencia-e-saude/noticia/2016/06/ondas-gravitacionais-sao-detectadas-pela-segunda-vez-nos-eua.html"
	).then(
		function (metadata) {
			// success handler
			console.log(metadata);
		},
		function (error) {
			// failure handler
			console.log(error);
		}
	);
};

export async function getPosts(req, res) {
	try {
		const query = await connection.query(
			"SELECT * FROM posts WHERE id = 5 ORDER BY created_at DESC LIMIT 20 "
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
					// failure handler
					console.log(error);
				}
			);
		}
		res.status(200).send(posts);
		console.log(posts);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
