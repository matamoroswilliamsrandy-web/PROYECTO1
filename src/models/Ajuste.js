const BaseModel = require('./BaseModel');

class Ajuste extends BaseModel {
    static async findAll() {
        const rows = await this.query('SELECT clave, valor FROM ajustes_inicio');
        // Convert array of [{clave, valor}] to single object {clave: valor}
        return rows.reduce((acc, current) => {
            acc[current.clave] = current.valor;
            return acc;
        }, {});
    }

    static async update(clave, valor) {
        const result = await this.execute(
            'UPDATE ajustes_inicio SET valor = ? WHERE clave = ?',
            [valor, clave]
        );
        return result.affectedRows;
    }

    static async updateMany(data) {
        for (const [clave, valor] of Object.entries(data)) {
            await this.update(clave, valor);
        }
    }
}

module.exports = Ajuste;
