import connection from '../db.js';
import joi from 'joi';

export async function signUpMiddlewares (req, res, next) {
    const { email, password, username, image } = req.body;

    // Schema
    const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        image: joi.string().required()
    });

    // Validate
    const { error } = schema.validate(req.body);
    if (error) {
        return res.sendStatus(400)
    }

    // Check if user already exists
    const checkEmail = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkEmail.rows.length > 0) {   
        console.log('Email already used');
        return res.sendStatus(409)
    }

    next();
}