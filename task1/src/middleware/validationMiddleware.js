function validateTime(req, res, next) {
    const { time } = req.body;
    const eventTime = new Date(time);
    if (eventTime.getTime() < Date.now()) {
        return res.status(400).json({ error: 'Event time must be in the future' });
    }
    next();
}

module.exports = {
    validateTime
};
