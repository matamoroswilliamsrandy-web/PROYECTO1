const BaseModel = require('./BaseModel');

class Galeria extends BaseModel {
    static async findAll() {
        return await this.query('SELECT * FROM galeria ORDER BY created_at DESC');
    }

    static async create(titulo, imagen) {
        const result = await this.execute(
            'INSERT INTO galeria (titulo, imagen) VALUES (?, ?)',
            [titulo, imagen]
        );
        return result.insertId;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM galeria WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Galeria;
