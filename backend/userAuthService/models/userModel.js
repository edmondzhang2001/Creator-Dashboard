const db = require('../config/db');

class User {
    static async createUser(userName, email, passwordHash) {
        const [result] = await db.execute(
            'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
            [userName, email, passwordHash]
        );
        return result;
    }

    static async findUserByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }
}

module.exports = User;