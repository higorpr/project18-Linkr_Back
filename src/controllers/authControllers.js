import connection from '../db.js';
import bcrypt from 'bcrypt';

export async function signUpControllers (req, res) {
    const body = req.body;

    // Hash password
    const passwordHash = bcrypt.hashSync(body.password, 10);

    // Insert user
    try{
        await connection.query(`
            INSERT INTO users (username, email, password, image) 
            VALUES ($1, $2, $3, $4)
        `, [body.username, body.email, passwordHash, body.image]);
        res.sendStatus(201);
    }
    catch (error) {
        res.sendStatus(500);
    }
}
