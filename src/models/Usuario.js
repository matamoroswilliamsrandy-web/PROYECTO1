const BaseModel = require('./BaseModel');

class Usuario extends BaseModel {
    static async findByUsername(username) {
        const rows = await this.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(username, password) {
        const result = await this.execute('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, password]);
        return result.insertId;
    }
}

module.exports = Usuario;
