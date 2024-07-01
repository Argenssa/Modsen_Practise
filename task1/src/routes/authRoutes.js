const express = require('express');
const { register, authorize, logout } = require('../controllers/authController');
const { validate } = require('../validation/validMiddleware');
const { userSchema } = require('../validation/userValidate');
const passport = require('../config/passport');

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/authorization', authorize);
router.get('/logout', passport.authenticate('jwt', { session: false }), logout);

router.get("/register", (req, res) => {
    res.send(`
        <form action="/auth/register" method="post">
            <label>Username:</label><input type="text" name="username" required><br>
            <label>Password:</label><input type="password" name="password" required><br>
            <label>Role:</label><input type="text" name="role" required><br>
            <button type="submit">Register</button>
        </form>
    `);
});

router.get("/authorization", (req, res) => {
    res.send(`
        <form action="/auth/authorization" method="post">
            <label>Username:</label><input type="text" name="username" required><br>
            <label>Password:</label><input type="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

module.exports = router;
