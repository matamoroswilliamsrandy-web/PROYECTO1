const Noticia = require('../models/Noticia');
const Evento = require('../models/Evento');
const Autoridad = require('../models/Autoridad');
const Galeria = require('../models/Galeria');
const Contacto = require('../models/Contacto');
const Ajuste = require('../models/Ajuste');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.inicio = catchAsync(async (req, res, next) => {
    let noticiasDestacadas = [];
    let eventosDestacados = [];

    try {
        noticiasDestacadas = await Noticia.findDestacadas() || [];
    } catch (err) {
        console.error('Error al obtener noticias destacadas:', err);
    }

    // Fallback: Si no hay noticias destacadas, mostrar las últimas 3 noticias generales
    if (!noticiasDestacadas || noticiasDestacadas.length === 0) {
        try {
            const todasNoticias = await Noticia.findAll() || [];
            noticiasDestacadas = todasNoticias.slice(0, 3);
        } catch (err) {
            console.error('Error al obtener noticias de fallback:', err);
        }
    }

    try {
        eventosDestacados = await Evento.findDestacados() || [];
    } catch (err) {
        console.error('Error al obtener eventos destacados:', err);
    }

    // Combinar y marcar el tipo con guards
    const destacados = [
        ...noticiasDestacadas.map(n => ({ ...n, tipo: 'noticia' })),
        ...eventosDestacados.map(e => ({ ...e, tipo: 'evento' }))
    ];

    // Ordenar por fecha de publicación/evento descendente (usando guards para fechas inexistentes)
    destacados.sort((a, b) => {
        const fechaA = new Date(a.tipo === 'noticia' ? (a.fecha_publicacion || a.created_at) : (a.fecha_evento || a.created_at));
        const fechaB = new Date(b.tipo === 'noticia' ? (b.fecha_publicacion || b.created_at) : (b.fecha_evento || b.created_at));
        return fechaB - fechaA;
    });

    const eventos = await Evento.findAll();
    const ajustes = await Ajuste.findAll();
    res.render('public/inicio', {
        title: 'Inicio',
        destacados,
        eventos,
        ajustes,
        path: '/'
    });
});

exports.noticias = catchAsync(async (req, res, next) => {
    const filter = req.query.filter || 'all';
    let allNoticias = await Noticia.findAll();

    const getLocalDateStr = (dateInput) => {
        const d = new Date(dateInput);
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    };

    allNoticias.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion));

    const now = new Date();
    const todayStr = getLocalDateStr(now);

    const weekAgoDate = new Date(now);
    weekAgoDate.setDate(now.getDate() - 7);
    const weekAgoStr = getLocalDateStr(weekAgoDate);

    const monthAgoDate = new Date(now);
    monthAgoDate.setMonth(now.getMonth() - 1);
    const monthAgoStr = getLocalDateStr(monthAgoDate);

    let filteredNoticias = allNoticias;

    if (filter === 'week') {
        filteredNoticias = allNoticias.filter(n => {
            const newsDateStr = n.fecha_publicacion instanceof Date
                ? n.fecha_publicacion.toISOString().split('T')[0]
                : String(n.fecha_publicacion).substring(0, 10);
            return newsDateStr >= weekAgoStr && newsDateStr < todayStr;
        });
    } else if (filter === 'month') {
        filteredNoticias = allNoticias.filter(n => {
            const newsDateStr = n.fecha_publicacion instanceof Date
                ? n.fecha_publicacion.toISOString().split('T')[0]
                : String(n.fecha_publicacion).substring(0, 10);
            return newsDateStr >= monthAgoStr && newsDateStr < todayStr;
        });
    }

    const topNews = allNoticias.slice(0, 3);

    res.render('public/noticias', {
        title: 'Noticias Institucionales',
        noticias: filteredNoticias,
        topNews: topNews,
        allNews: allNoticias,
        path: '/noticias',
        currentFilter: filter,
        currentPage: 0,
        totalPages: 1
    });
});

exports.buscarNoticias = catchAsync(async (req, res, next) => {
    const query = req.query.q;
    if (!query) {
        return res.redirect('/noticias');
    }

    const noticias = await Noticia.search(query);
    const todasNoticias = await Noticia.findAll();
    const topNews = todasNoticias.slice(0, 4);

    res.render('public/noticias', {
        title: `Resultados para: ${query}`,
        noticias: noticias,
        topNews: topNews,
        allNews: todasNoticias,
        path: '/noticias',
        searchQuery: query
    });
});

exports.detalleNoticia = catchAsync(async (req, res, next) => {
    const noticia = await Noticia.findById(req.params.id);
    if (!noticia) return next(new AppError('Noticia no encontrada', 404));

    res.render('public/detalle-noticia', { title: noticia.titulo, noticia, path: '/noticias' });
});

exports.detalleEvento = catchAsync(async (req, res, next) => {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return next(new AppError('Evento no encontrado', 404));

    res.render('public/detalle-evento', { title: evento.titulo, evento, path: '/eventos' });
});

exports.eventos = catchAsync(async (req, res, next) => {
    const filter = req.query.filter || 'all';
    let allEventos = await Evento.findAll();
    let eventosDestacados = [];
    try {
        eventosDestacados = await Evento.findDestacados() || [];
    } catch (err) {
        console.error('Error al obtener eventos destacados:', err);
    }

    const getLocalDateStr = (dateInput) => {
        const d = new Date(dateInput);
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    };

    allEventos.sort((a, b) => new Date(b.fecha_evento) - new Date(a.fecha_evento));

    const now = new Date();
    const todayStr = getLocalDateStr(now);

    const weekAgoDate = new Date(now);
    weekAgoDate.setDate(now.getDate() - 7);
    const weekAgoStr = getLocalDateStr(weekAgoDate);

    const monthAgoDate = new Date(now);
    monthAgoDate.setMonth(now.getMonth() - 1);
    const monthAgoStr = getLocalDateStr(monthAgoDate);

    let filteredEventos = allEventos;

    if (filter === 'week') {
        filteredEventos = allEventos.filter(e => {
            const eventDateStr = e.fecha_evento instanceof Date
                ? e.fecha_evento.toISOString().split('T')[0]
                : String(e.fecha_evento).substring(0, 10);
            return eventDateStr >= weekAgoStr && eventDateStr < todayStr;
        });
    } else if (filter === 'month') {
        filteredEventos = allEventos.filter(e => {
            const eventDateStr = e.fecha_evento instanceof Date
                ? e.fecha_evento.toISOString().split('T')[0]
                : String(e.fecha_evento).substring(0, 10);
            return eventDateStr >= monthAgoStr && eventDateStr < todayStr;
        });
    }

    res.render('public/eventos', {
        title: 'Eventos',
        eventos: filteredEventos,
        eventosDestacados,
        path: '/eventos',
        currentFilter: filter
    });
});

exports.autoridades = catchAsync(async (req, res, next) => {
    let autoridades = await Autoridad.findAll() || [];

    // Ordenar: El Director siempre va primero
    autoridades.sort((a, b) => {
        const esDirA = a.cargo.toLowerCase().includes('director');
        const esDirB = b.cargo.toLowerCase().includes('director');
        if (esDirA && !esDirB) return -1;
        if (!esDirA && esDirB) return 1;
        return 0;
    });

    res.render('public/autoridades', { title: 'Autoridades', autoridades, path: '/autoridades' });
});

exports.galeria = catchAsync(async (req, res, next) => {
    const imagenes = await Galeria.findAll();
    res.render('public/galeria', { title: 'Galería', imagenes, path: '/galeria' });
});

exports.contacto = catchAsync(async (req, res, next) => {
    if (req.method === 'POST') {
        const { nombre, email, asunto, mensaje } = req.body;
        if (!nombre || !email || !mensaje) {
            return res.render('public/contacto', {
                title: 'Contacto',
                path: '/contacto',
                error: 'Por favor completa todos los campos obligatorios.',
                success: null
            });
        }
        await Contacto.create({ nombre, email, asunto, mensaje });
        return res.render('public/contacto', {
            title: 'Contacto',
            path: '/contacto',
            error: null,
            success: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.'
        });
    }
    res.render('public/contacto', { title: 'Contacto', path: '/contacto', error: null, success: null });
});

exports.historia = catchAsync(async (req, res, next) => {
    const ajustes = await Ajuste.findAll();
    res.render('public/historia', { title: 'Historia Institucional', ajustes, path: '/historia' });
});

exports.misionVision = catchAsync(async (req, res, next) => {
    const ajustes = await Ajuste.findAll();
    res.render('public/mision-vision', { title: 'Misión y Visión', ajustes, path: '/mision-vision' });
});

exports.propuestaEducativa = catchAsync(async (req, res, next) => {
    const ajustes = await Ajuste.findAll();
    res.render('public/propuesta-educativa', { title: 'Propuesta Educativa', ajustes, path: '/propuesta-educativa' });
});

