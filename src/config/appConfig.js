const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'institucional_db',
        connectionLimit: 10
    },
    session: {
        secret: process.env.SESSION_SECRET || 'antonio-raymondi-secret-2026',
        name: 'ar.session',
        ttl: 1000 * 60 * 60 * 8 // 8 hours
    },
    paths: {
        views: path.join(__dirname, '../views'),
        public: path.join(__dirname, '../../public'),
        uploads: path.join(__dirname, '../../public/uploads')
    }
};

module.exports = config;
