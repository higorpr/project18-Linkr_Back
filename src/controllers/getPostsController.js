import connection from "../database/db.js";
import urlMetadata from "url-metadata";
import { mainPost } from "../repositories/mainPostRepository.js";
import async from "async";

export async function getPosts(req, res) {
	const userId = res.locals.userId;

	const rule =
		"WHERE (pp.user_id IN (SELECT followed_id  FROM follows WHERE follower_id=$1) OR pp.user_id = $1)";
	const array = [userId];
	try {
		const query = await mainPost(
			rule,
			array,
			req.query?.lastPost,
			req.query?.firstPost
		);
		let i = 0;
		const posts = query.rows;

		async.forEachOf(
			posts,
			function (post, index, callback) {
				urlMetadata(post.metadata?.link, {
					descriptionLength: 150,
					timeout: 1000,
				}).then(
					function (metadata) {
						post.metadata = {
							linkImage: metadata.image,
							linkTitle: metadata.title,
							linkDescription: metadata.description,
							source: metadata.source,
							...post.metadata,
						};
						posts[index] = post;
						callback(null);
					},
					function (error) {
						callback(null);
					}
				);
			},
			function (err) {
				if (!err) {
					res.status(200).send(posts);
				}
			}
		);
	} catch (err) {
		res.sendStatus(500);
		console.log(err);
	}
}

export async function timelineUpdate(req, res) {
	const userId = res.locals.userId;
	const lastPostId = req.params.id;
	let count = 0;

	const rule =
		"WHERE (pp.user_id IN (SELECT followed_id  FROM follows WHERE follower_id=$1) OR pp.user_id = $1) AND pp.id > $2";
	const array = [userId, lastPostId];

	try {
		const query = await mainPost(rule, array);

		let i = 0;
		const posts = query.rows;
		count = posts.length;

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
