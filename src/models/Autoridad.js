const BaseModel = require('./BaseModel');

class Autoridad extends BaseModel {
    static async findAll() {
        return await this.query('SELECT * FROM autoridades ORDER BY orden ASC');
    }

    static async findById(id) {
        const rows = await this.query('SELECT * FROM autoridades WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { nombre, cargo, imagen, orden } = data;
        const result = await this.execute(
            'INSERT INTO autoridades (nombre, cargo, imagen, orden) VALUES (?, ?, ?, ?)',
            [nombre, cargo, imagen, orden || 0]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { nombre, cargo, imagen, orden } = data;
        let sql = 'UPDATE autoridades SET nombre = ?, cargo = ?, orden = ? WHERE id = ?';
        let params = [nombre, cargo, orden, id];

        if (imagen) {
            sql = 'UPDATE autoridades SET nombre = ?, cargo = ?, orden = ?, imagen = ? WHERE id = ?';
            params = [nombre, cargo, orden, imagen, id];
        }

        const result = await this.execute(sql, params);
        return result.affectedRows;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM autoridades WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Autoridad;
