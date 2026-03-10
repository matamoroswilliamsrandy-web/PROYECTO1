const db = require('./src/config/database');

const fields = {
    // Historia Page
    'hist_hero_sub': 'Más de 30 años formando ciudadanos íntegros con excelencia académica.',
    'hist_seccion1_titulo': 'Forjando el futuro desde nuestra base institucional',
    'hist_seccion1_desc': 'Nuestra institución nació con la firme convicción de brindar una educación de calidad, accesible y centrada en el desarrollo integral del estudiante.',
    'hist_img1': '/img/hero-estudiantes.jpg',
    'hist_t1_anio': '1995', 'hist_t1_titulo': 'Primeras Piedras', 'hist_t1_desc': 'Iniciamos nuestras labores con una infraestructura modesta pero un corazón lleno de sueños.',
    'hist_t2_anio': '2010', 'hist_t2_titulo': 'Expansión Moderna', 'hist_t2_desc': 'Inauguramos nuestros laboratorios de ciencias y el pabellón de secundaria.',
    'hist_t3_anio': '2024', 'hist_t3_titulo': 'Excelencia Digital', 'hist_t3_desc': 'Implementación de aulas híbridas y tecnología de punta para la formación actual.',

    // Misión y Visión
    'mv_hero_sub': 'Nuestros principios fundamentales que guían cada paso en la formación de los líderes del mañana.',
    'mv_mision_titulo': 'Formar líderes con valores y excelencia',
    'mv_mision_desc': 'Proporcionar una educación integral de alta calidad, fundamentada en valores éticos y cristianos, permitiendo alcanzar el máximo potencial.',
    'mv_mision_img': '/img/hero-estudiantes.jpg',
    'mv_vision_titulo': 'Ser referentes de innovación educativa',
    'mv_vision_desc': 'Para el año 2030, aspiramos a ser reconocidos como la institución educativa líder a nivel nacional.',
    'mv_vision_img': '/img/hero-estudiantes.jpg',
    'mv_val1_t': 'Respeto', 'mv_val1_d': 'Valoramos la diversidad y la dignidad de cada persona.',
    'mv_val2_t': 'Integridad', 'mv_val2_d': 'Actuamos con honestidad y transparencia.',
    'mv_val3_t': 'Excelencia', 'mv_val3_d': 'Buscamos la máxima calidad en todo lo que hacemos.',
    'mv_val4_t': 'Solidaridad', 'mv_val4_d': 'Nos comprometemos con el bienestar de los demás.',

    // Propuesta Educativa
    'pe_hero_title': 'Propuesta Educativa',
    'pe_hero_sub': 'Un modelo pedagógico diseñado para el desarrollo integral del estudiante en el siglo XXI.',
    'pe_seccion1_titulo': 'Educación con Propósito',
    'pe_seccion1_desc': 'Nuestra metodología integra el conocimiento académico con el desarrollo de habilidades blandas y pensamiento crítico.',
    'pe_img1': '/img/hero-estudiantes.jpg',
    'pe_pil1_t': 'Aprendizaje Activo', 'pe_pil1_d': 'El estudiante es el centro del proceso, fomentando la curiosidad y experimentación.',
    'pe_pil2_t': 'Tecnología Aplicada', 'pe_pil2_d': 'Uso de herramientas digitales para potenciar la investigación y colaboración.',
    'pe_pil3_t': 'Formación Humana', 'pe_pil3_d': 'Un sólido programa de valores que acompaña el crecimiento emocional.',
    'pe_pil4_t': 'Idiomas y Globalización', 'pe_pil4_d': 'Enfoque en el dominio del inglés para un mundo interconectado.',

    // Home Page Card Links & Titles
    'card1_titulo': 'Propuesta Educativa',
    'card1_btn': 'SABER MÁS',
    'card1_link': '/propuesta-educativa',
    'card2_titulo': 'Misión y Visión',
    'card2_btn': 'VER PROPÓSITO',
    'card2_link': '/mision-vision',
    'card3_titulo': 'Historia de la Institución',
    'card3_btn': 'CONOCER HISTORIA',
    'card3_link': '/historia'
};

async function init() {
    console.log('Iniciando inserción de campos...');
    for (const [clave, valor] of Object.entries(fields)) {
        try {
            // Usamos REPLACE INTO para asegurar que los enlaces y valores base sean los correctos
            await db.execute('REPLACE INTO ajustes_inicio (clave, valor) VALUES (?, ?)', [clave, valor]);
        } catch (err) {
            console.error(`Error en ${clave}:`, err.message);
        }
    }
    console.log('Proceso completado.');
    process.exit(0);
}

init();
