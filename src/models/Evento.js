const BaseModel = require('./BaseModel');

class Evento extends BaseModel {
    static async findAll() {
        return await this.query('SELECT * FROM eventos ORDER BY fecha_evento DESC');
    }

    static async findDestacados() {
        return await this.query('SELECT * FROM eventos WHERE destacado = TRUE ORDER BY fecha_evento DESC');
    }

    static async findById(id) {
        const rows = await this.query('SELECT * FROM eventos WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { titulo, descripcion, fecha_evento, lugar, imagen, destacado } = data;
        const result = await this.execute(
            'INSERT INTO eventos (titulo, descripcion, fecha_evento, lugar, imagen, destacado) VALUES (?, ?, ?, ?, ?, ?)',
            [titulo, descripcion, fecha_evento, lugar, imagen, destacado || false]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { titulo, descripcion, fecha_evento, lugar, imagen, destacado } = data;
        let sql = 'UPDATE eventos SET titulo = ?, descripcion = ?, fecha_evento = ?, lugar = ?, destacado = ? WHERE id = ?';
        let params = [titulo, descripcion, fecha_evento, lugar, destacado || false, id];

        if (imagen) {
            sql = 'UPDATE eventos SET titulo = ?, descripcion = ?, fecha_evento = ?, lugar = ?, imagen = ?, destacado = ? WHERE id = ?';
            params = [titulo, descripcion, fecha_evento, lugar, imagen, destacado || false, id];
        }

        const result = await this.execute(sql, params);
        return result.affectedRows;
    }

    static async delete(id) {
        const result = await this.execute('DELETE FROM eventos WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Evento;
