import { loginSchema } from "../models/loginSchema.js";
import { compareSync } from "bcrypt";
import { getLoginData } from "../repositories/authRepository.js";

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
