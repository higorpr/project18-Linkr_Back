import { loginSchema } from "../models/loginSchema.js";
import { compareSync } from "bcrypt";
import { getLoginData } from "../repositories/authRepository.js";
import connection from '../database/db.js';
import joi from 'joi';

export async function loginValidation(req, res, next) {
	const loginInfo = req.body;
	const validationErrors = loginSchema.validate(loginInfo, {
		abortEarly: false,
	}).error;

	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	}

	// Check if email exists
	// if exists, if it matches the password
	try {
		const userResponse = await getLoginData(loginInfo.email);
		
        if (userResponse.rows.length === 0) {
			return res
				.status(404)
				.send("Incorrect email and password combination");
		}

        const user = userResponse.rows[0];
        const userPassword = user.password;
        const passwordCheck = compareSync(loginInfo.password,userPassword)

        if (!passwordCheck) {
            return res
				.status(404)
				.send("Incorrect email and password combination");
        }

        delete user.password;
        delete user.email
        res.locals.user = user

        
	} catch (err) {
		console.log(err.message);
		return res.sendStatus(500);
	}

	next();
}

export async function signUpMiddlewares (req, res, next) {
    const { email } = req.body;

    // Schema
    const schema = joi.object({
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        image: joi.string().regex(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/).required()
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