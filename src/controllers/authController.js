import { v4 as uuidV4 } from "uuid";
import {
	deleteSession,
	getSession,
	postSession,
} from "../repositories/authRepository.js";
import bcrypt from 'bcrypt';
import connection from '../database/db.js';

export async function login(req, res) {
	const user = res.locals.user;
	const token = uuidV4();

	user.token = token;

	try {
		const userSession = await getSession(user.id);
		// console.log(userSession.rows.length)
		if (userSession.rows.length !== 0) {
			await deleteSession(user.id);
			await postSession(user.id, user.token);
		} else {
			await postSession(user.id, user.token);
		}
	} catch (err) {
		console.log(err.message);
		return res.sendStatus(500);
	}

	delete user.id;

	res.status(200).send(user);
}

export async function logout(req, res) {
	const userId = res.locals.userId;

	try {
		await deleteSession(userId);
	} catch (err) {
		console.log(err.message);
		return res.sendStatus(500);
	}
	res.sendStatus(202);
}

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