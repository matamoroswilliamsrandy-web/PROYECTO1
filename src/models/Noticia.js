const BaseModel = require('./BaseModel');

class Noticia extends BaseModel {
    static async findAll({ limit = null, offset = 0 } = {}) {
        let sql = 'SELECT * FROM noticias ORDER BY fecha_publicacion DESC';
        const params = [];
        if (limit) {
            sql += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
        }
        return await this.query(sql, params);
    }

    static async count() {
        const rows = await this.query('SELECT COUNT(*) AS total FROM noticias');
        return rows[0].total;
    }

    static async findDestacadas() {
        return await this.query('SELECT * FROM noticias WHERE destacada = 1 ORDER BY fecha_publicacion DESC LIMIT 5');
    }

    static async findById(id) {
        const rows = await this.query('SELECT * FROM noticias WHERE id = ?', [id]);
        return rows[0];
    }

    static async search(query) {
        const searchTerm = `%${query}%`;
        return await this.query(
            'SELECT * FROM noticias WHERE titulo LIKE ? OR contenido LIKE ? ORDER BY fecha_publicacion DESC',
            [searchTerm, searchTerm]
        );
    }

    static async create(data) {
        const { titulo, contenido, imagen, destacada } = data;
        const result = await this.execute(
            'INSERT INTO noticias (titulo, contenido, imagen, destacada, fecha_publicacion) VALUES (?, ?, ?, ?, NOW())',
            [titulo, contenido, imagen, destacada ? 1 : 0]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { titulo, contenido, imagen, destacada } = data;
        let sql = 'UPDATE noticias SET titulo = ?, contenido = ?, destacada = ? WHERE id = ?';
        let params = [titulo, contenido, destacada ? 1 : 0, id];

        if (imagen) {
            sql = 'UPDATE noticias SET titulo = ?, contenido = ?, imagen = ?, destacada = ? WHERE id = ?';
            params = [titulo, contenido, imagen, destacada ? 1 : 0, id];
        }

        const result = await this.execute(sql, params);
        return result.affectedRows;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM noticias WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Noticia;
