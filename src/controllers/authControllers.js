import connection from '../database/db.js';
import bcrypt from 'bcrypt';

export async function signUpControllers (req, res) {
    const { username, email, password, image} = req.body;

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Insert user
    try{
        await connection.query(`
        INSERT INTO
        users (username, email, password, image)
        VALUES
        ($1,$2,$3,$4)
    
    `,[username, email, passwordHash, image]);
        res.sendStatus(201);
    }
    catch (error) {
        res.sendStatus(500);
    }
}
