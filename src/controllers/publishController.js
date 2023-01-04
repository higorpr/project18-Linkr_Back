import { connection } from "../database/db.js";

export async function publishLink(req, res){
    const { authorization } = req.headers;
    
    const token = authorization?.replace('Bearer ', '');
    
    //if not logged in, must unauthorize publication
    if(!token){
        return res.status(401).send("Unauthorized!")
    }
    
    const {text, link} = req.body;

    try{
        const user = (await connection.query (`
            SELECT u.* 
            FROM users u JOIN sessions s 
            ON u.id = s.user_id 
            WHERE s.token = $1`,[token])).rows;
        
        //User exists?
        if(user.length === 0){
            return res.send("User not Found!").status(404);
        }

        const post = (await connection.query(`
            SELECT * 
            FROM posts 
            WHERE link = $1;`,[link])).rows;

        //Link exists?
        if(post.length !== 0){
            return res.send("This link already exists!").status(409);
        }

        else {
            await connection.query(`
            INSERT 
            INTO posts 
                (text, link, user_id) 
            VALUES ($1, $2, $3)
            `, [text, link, user[0].id])
            
            return res.sendStatus(201);
            
        }

    } catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
}