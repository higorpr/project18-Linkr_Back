import { hashtagPosts, UsersLiked } from "../repositories/postRepository.js";

export async function getHashtagPosts(req, res) {
	const { hashtag } = req.body;

	if (!hashtag) {
		return res.sendStatus(400);
	}

	try {
		const response = await hashtagPosts(hashtag);
		console.log(response.rows);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	res.sendStatus(200);
}

export async function getUsersLiked(req, res) {
	const postId = res.locals.postId;

	try {
		const usersResponse = await UsersLiked(postId);
		const users = usersResponse.rows.map((user) => user.username);
		res.status(200).send(users);
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
}
