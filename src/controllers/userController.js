import connection from "../database/db.js"


export async function getUserLinks(req, res){
    const {id} = req.params;

    try{
        const user = (await connection.query(`
            SELECT * 
            FROM users 
            WHERE id = $1;
        `,[id])).rows;

        if(user.length === 0 ){
            return res.status(404).send("User not found!");
        }

        const posts = (await connection.query(`
            SELECT u.username, u.id, u.image, p.* 
            FROM users u JOIN posts p
                ON  u.id = p.user_id
            WHERE p.user_id = $1 
            ORDER BY created_at DESC 
            LIMIT 20;    
        `, [id])).rows;

        res.status(200).send(posts);

    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }

}