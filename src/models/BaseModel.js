const db = require('../config/database');

class BaseModel {
    /**
     * Executes a query and returns the rows.
     */
    static async query(sql, params = []) {
        try {
            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Executes a query (INSERT/UPDATE/DELETE) and returns the result metadata.
     */
    static async execute(sql, params = []) {
        try {
            const [result] = await db.execute(sql, params);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BaseModel;
