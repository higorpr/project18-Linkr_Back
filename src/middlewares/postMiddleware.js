import {
	getAllHashtags,
	getAllPostIds,
} from "../repositories/postRepository.js";

export async function checkPostIdParameter(req, res, next) {
	const { postId } = req.params;

	if (!postId) return res.sendStatus(400);

	if (!Number(postId)) return res.sendStatus(400);

	try {
		const idsResponse = await getAllPostIds();
		const ids = idsResponse.rows.map((idRes) => idRes.id);

		if (!ids.includes(Number(postId))) {
			return res.sendStatus(404);
		}
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	res.locals.postId = postId;

	next();
}

export async function checkHashtag(req, res, next) {
	const { hashtag } = req.params;

	if (!hashtag) {
		return res.sendStatus(400);
	}

	try {
		const allHashtagsRes = await getAllHashtags();
		const allHashtags = allHashtagsRes.rows.map((h) => h.name);
		if (!allHashtags.includes(hashtag)) return res.sendStatus(404);
		res.locals.hashtag = hashtag;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}
	
	next();
}
