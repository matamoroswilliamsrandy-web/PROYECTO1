const db = require('../src/config/database');

const init = async () => {
    try {
        console.log('Iniciando migración de ajustes...');

        // 1. Crear tabla
        await db.execute(`
            CREATE TABLE IF NOT EXISTS ajustes_inicio (
                id INT AUTO_INCREMENT PRIMARY KEY,
                clave VARCHAR(100) NOT NULL UNIQUE,
                valor TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // 2. Datos iniciales (Seeders)
        const ajustes = [
            // Stats
            ['stats_estudiantes', '1500'],
            ['stats_docentes', '80'],
            ['stats_años', '50'],
            ['stats_premios', '120'],

            // Highlight 1
            ['card1_titulo', 'Vida Estudiantil'],
            ['card1_desc', 'Descubre las actividades extracurriculares.'],
            ['card1_img', '/uploads/card-1.jpg'],
            ['card1_link', '/galeria'],
            ['card1_btn', 'Ver Galería'],

            // Highlight 2
            ['card2_titulo', 'Infraestructura'],
            ['card2_desc', 'Laboratorios y aulas modernas.'],
            ['card2_img', '/uploads/card-2.jpg'],
            ['card2_link', '/colegio'],
            ['card2_btn', 'Conocer Más'],

            // Highlight 3
            ['card3_titulo', 'Admisión 2026'],
            ['card3_desc', 'Únete a nuestra familia educativa.'],
            ['card3_img', '/uploads/card-3.jpg'],
            ['card3_link', '/contacto'],
            ['card3_btn', 'Postular Ahora']
        ];

        for (const [clave, valor] of ajustes) {
            await db.execute(
                'INSERT INTO ajustes_inicio (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = valor',
                [clave, valor]
            );
        }

        console.log('✅ Base de datos inicializada correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
};

init();
