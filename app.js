const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const config = require('./src/config/appConfig');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

// --- Configuraciones ---
app.set('port', config.port);
app.set('views', config.paths.views);
app.set('view engine', 'ejs');

// --- Middlewares Globales ---
app.use(morgan('dev'));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: config.env === 'production',
        httpOnly: true,
        maxAge: config.session.ttl
    },
    name: config.session.name
}));

// Variables Globales de Plantilla
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.baseUrl = `${req.protocol}://${req.get('host')}`;
    res.locals.currentUrl = `${res.locals.baseUrl}${req.originalUrl}`;
    next();
});

// Archivos Estáticos
app.use(express.static(config.paths.public));

// --- Rutas ---
app.use('/', require('./src/routes/web.routes'));
app.use('/auth', require('./src/routes/auth.routes'));
app.use('/panel-director', require('./src/routes/admin.routes'));

// --- Manejo de Errores ---
app.use(notFound);
app.use(errorHandler);

// Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log(`🚀 Servidor [${config.env}] corriendo en http://localhost:${app.get('port')}`);
});
