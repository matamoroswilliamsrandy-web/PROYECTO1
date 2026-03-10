const bcrypt = require('bcrypt');
const db = require('../src/config/database');

async function createUser(username, password) {
    try {
        console.log(`Buscando si el usuario "${username}" ya existe...`);
        const [existing] = await db.execute('SELECT id FROM usuarios WHERE username = ?', [username]);

        if (existing.length > 0) {
            console.log(`El usuario "${username}" ya existe. Actualizando contraseña...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('UPDATE usuarios SET password = ? WHERE username = ?', [hashedPassword, username]);
            console.log('Contraseña actualizada exitosamente.');
        } else {
            console.log(`Creando nuevo usuario "${username}"...`);
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hashedPassword]);
            console.log('Usuario creado exitosamente.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error al crear/actualizar usuario:', error);
        process.exit(1);
    }
}

// Obtener argumentos de línea de comandos o usar valores por defecto
const args = process.argv.slice(2);
const username = args[0] || 'director';
const password = args[1] || 'director123';

createUser(username, password);
