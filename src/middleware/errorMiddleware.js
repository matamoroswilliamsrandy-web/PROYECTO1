const config = require('../config/appConfig');

/**
 * Synchronous error handler for 404 routes.
 */
exports.notFound = (req, res, next) => {
    res.status(404).render('public/inicio', {
        title: '404 - No Encontrado',
        error: 'La página que buscas no existe.',
        path: req.path
    });
};

/**
 * Centralized error handling middleware.
 */
exports.errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (config.env === 'development') {
        sendErrorDev(err, res);
    } else {
        sendErrorProd(err, res);
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).render('public/inicio', {
            title: 'Error',
            error: err.message,
            path: '/'
        });
    } else {
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).render('public/inicio', {
            title: 'Algo salió mal',
            error: 'Por favor, inténtelo de nuevo más tarde.',
            path: '/'
        });
    }
};
