import connection from "../database/db.js";
import urlMetadata from "url-metadata";
import { mainPost } from "../repositories/mainPostRepository.js";

let lastPost = null;
let lastPostId = 0;
export async function getPosts(req, res) {
	const userId = res.locals.userId;
	const rule = 'WHERE pp.user_id IN (SELECT followed_id  FROM follows WHERE follower_id=$1) OR pp.user_id=$1'
	const a = [userId]
	try {
		const query = await mainPost(rule, array);

		let i = 0;
		const posts = query.rows;

		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].metadata?.link, {
				descriptionLength: 150,
				timeout: 100,
			}).then(
				function (metadata) {
					posts[i].metadata = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i].metadata,
					};
				},
				function (error) {}
			);
		}

		// get the first post rendered as last post and get the id of the lastPost
		lastPost = posts[0];
		lastPostId = lastPost.id;

		return res.status(200).send(posts);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}

export async function timelineUpdate(req, res) {
	const userId = res.locals.userId;
	const lastPostId = req.params.id;
	let count = 0;
	if (!lastPostId) {
		console.log("erro no if");
		return res.send("erro no if");
	}
	const rule =
		"WHERE pp.user_id IN (SELECT followed_id  FROM follows WHERE follower_id=$1) OR pp.user_id = $1 AND pp.id > $2";
	const array = [userId, lastPostId];
	console.log(userId);
	try {
		const query = await mainPost(rule, array);

		let i = 0;
		const posts = query.rows;
		count = posts.length;
		console.log(count);
		for (i = 0; i < posts.length; i++) {
			await urlMetadata(posts[i].metadata?.link, {
				descriptionLength: 150,
				timeout: 100,
			}).then(
				function (metadata) {
					posts[i].metadata = {
						linkImage: metadata.image,
						linkTitle: metadata.title,
						linkDescription: metadata.description,
						...posts[i],
					};
				},
				function (error) {}
			);
		}

		return res.json({ count, posts });
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}
