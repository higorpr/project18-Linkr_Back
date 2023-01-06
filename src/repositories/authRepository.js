import connection from "../database/db.js";

export async function getLoginData(email) {
	return connection.query(
		`
        SELECT
            id, username, email, password, image
        FROM
            users
        WHERE
            email = $1
    `,
		[email]
	);
}

export async function getSession(userId) {
	return connection.query(
		`
        SELECT
            *
        FROM
            sessions
        WHERE
            user_id = $1
    `,
		[userId]
	);
}

export async function deleteSession(userId) {
	return connection.query(
		`
        DELETE FROM
            sessions
        WHERE
            user_id = $1
    `,
		[userId]
	);
}

export async function postSession(userId, token) {
	return connection.query(
		`
        INSERT INTO
            sessions (user_id, token)
        VALUES
            ($1, $2)
    `,
		[userId, token]
	);
}

export async function getIdFromToken(token) {
	return connection.query(
		`
        SELECT
            *
        FROM
            sessions
        WHERE
            token = $1
    `,
		[token]
	);
}
