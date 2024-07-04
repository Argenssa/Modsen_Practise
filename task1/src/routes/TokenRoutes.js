const express = require('express');
const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models/RefreshToken.js');
const { User } = require('../models/User.js');
const router = express.Router();

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).send('Refresh token required');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await RefreshToken.findOne({ where: { token: refreshToken, userId: decoded.userId } });

        if (!storedToken) {
            return res.status(403).send('Invalid refresh token');
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(403).send('Invalid refresh token');
        }

        // Generate new tokens
        const newAccessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Update refresh token in DB
        storedToken.token = newRefreshToken;
        storedToken.expires = new Date(Date.now() + 7*24*60*60*1000);
        await storedToken.save();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).send('Invalid refresh token');
    }
});

module.exports = router;
