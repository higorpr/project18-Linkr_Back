import { getAllPostIds } from "../repositories/postRepository.js";

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
