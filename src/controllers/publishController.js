import connection from "../database/db.js";
import {
	deleteFromPost,
	deleteFromPostHashtag,
	deleteFromPostLikes,
	deleteFromPostsComments,
	deleteFromPublishedPosts,
	insertHashtags,
	insertPost,
	insertPostHashtag,
	insertPublishedPost,
	searchHashtags,
	searchLink,
	searchUser,
} from "../repositories/publishRepository.js";

export async function publishLink(req, res) {
	/*const { authorization } = req.headers;

	const token = authorization?.replace("Bearer ", "");

	//if not logged in, must unauthorize publication
	if (!token) {
		return res.status(401).send("Unauthorized!");
	}
*/ const { userId } = res.locals;
	const { text, link } = req.body;

	try {
		const user = "Higor";
		if (!user) {
			return res.status(404).send("User not Found!");
		}

		const trends = searchHashtags(text);

		const postId = await insertPost(text, link, userId);
		await insertHashtags(trends);
		await insertPostHashtag(trends, postId);
		const publishedPostId = await insertPublishedPost(userId, postId);

		return res.status(201).send(publishedPostId);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500).send(err.message);
	}
}

export async function deletePostFromBd(req, res) {
	const { authorization } = req.headers;
	const { id } = req.params;

	const token = authorization?.replace("Bearer ", "");

	//if not logged in, must unauthorize publication
	if (!token) {
		return res.status(401).send("Unauthorized!");
	}

	try {
		await deleteFromPostLikes(id);
		await deleteFromPostsComments(id);
		await deleteFromPublishedPosts(id);
		await deleteFromPostHashtag(id);
		await deleteFromPost(id);

		res.sendStatus(200);
	} catch (err) {
		console.log(err);
		res.sendStatus(500);
	}
}
