const BaseModel = require('./BaseModel');

class Contacto extends BaseModel {
    static async findAll() {
        return await this.query('SELECT * FROM contacto ORDER BY fecha_envio DESC');
    }

    static async create(data) {
        const { nombre, email, asunto, mensaje } = data;
        const result = await this.execute(
            'INSERT INTO contacto (nombre, email, asunto, mensaje) VALUES (?, ?, ?, ?)',
            [nombre, email, asunto || null, mensaje]
        );
        return result.insertId;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM contacto WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Contacto;
