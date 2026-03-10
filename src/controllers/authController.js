const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const AppError = require('../utils/AppError');

exports.mostrarLogin = (req, res) => {
    res.render('admin/login', { error: null });
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const usuario = await Usuario.findByUsername(username);

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.render('admin/login', { error: 'Credenciales inválidas' });
        }

        req.session.usuario = usuario;
        res.redirect('/panel-director');

    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

exports.mostrarDashboard = (req, res) => {
    res.render('admin/dashboard', { user: req.session.usuario });
};
