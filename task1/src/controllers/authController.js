const { Registration } = require("../reg_auth/Registration");
const { Authorization } = require("../reg_auth/Authorization");
const { RefreshToken } = require("../models/RefreshToken");

async function register(req, res, next) {
    const { username, password, role } = req.body;
    try {
        const { token, refreshToken } = await Registration(username, password, role);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
}

async function authorize(req, res, next) {
    const { username, password } = req.body;
    try {
        const { token, refreshToken } = await Authorization(username, password);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
}

async function logout(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    try {
        await RefreshToken.destroy({ where: { refreshToken } });
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    authorize,
    logout
};
