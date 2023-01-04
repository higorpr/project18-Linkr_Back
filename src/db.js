import pkg from 'pg';

const { Pool } = pkg;

const connection = new Pool({
    user: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'linkr'
});

export default connection;