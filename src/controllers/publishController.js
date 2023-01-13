import connection from "../database/db.js";
import { deleteFromPost, deleteFromPostHashtag,
		 insertHashtags, insertPost, insertPostHashtag, 
		 searchHashtags, searchLink, searchUser } from "../repositories/publishRepository.js";

export async function publishLink(req, res) {
	/*const { authorization } = req.headers;

	const token = authorization?.replace("Bearer ", "");

	//if not logged in, must unauthorize publication
	if (!token) {
		return res.status(401).send("Unauthorized!");
	}
*/
	const { text, link } = req.body;
	
	try {
		const user = "Higor";
		if(!user){
			return res.status(404).send("User not Found!");
		}

		const post = await searchLink(link);
		if (post) {
			return res.status(409).send("This link already exists!");
		}

		const trends = searchHashtags(text);

		
		await insertPost(text, link, 1);
		await insertHashtags(trends);
		await insertPostHashtag(link, trends);
		
		return res.sendStatus(201);
	
	} catch (err) {
		console.log(err);
		return res.sendStatus(500).send(err.message)
	}
}

export async function deletePostFromBd(req, res){
	const { authorization } = req.headers;
	const { id } = req.params;

	const token = authorization?.replace("Bearer ", "");

	//if not logged in, must unauthorize publication
	if (!token) {
		return res.status(401).send("Unauthorized!");
	}

	try{
		await deleteFromPostHashtag(id)
		await deleteFromPost(id)

		res.sendStatus(200);
	} catch(err) {
		console.log(err);
		res.sendStatus(500);
	}
	

}