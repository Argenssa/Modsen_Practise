const { MeetUp } = require('../models/MeetUp');
const { UserMeetUp } = require('../models/UserMeetUp');

async function getMeetUps(req, res, next) {
    try {
        const meetUps = await MeetUp.findAll();
        res.json(meetUps);
    } catch (error) {
        next(error);
    }
}

async function createMeetUp(req, res, next) {
    const { name, description, tags, time, place } = req.body;
    try {
        const newMeetUp = await MeetUp.create({ name, description, tags, time, place });
        res.json(newMeetUp);
    } catch (error) {
        next(error);
    }
}

async function updateMeetUp(req, res, next) {
    const { id, name, description, tags, time, place } = req.body;
    try {
        const meetUp = await MeetUp.findByPk(id);
        if (meetUp) {
            await meetUp.update({ name, description, tags, time, place });
            res.json(meetUp);
        } else {
            res.status(404).json({ error: 'MeetUp not found' });
        }
    } catch (error) {
        next(error);
    }
}

async function deleteMeetUp(req, res, next) {
    const { id } = req.body;
    try {
        const meetUp = await MeetUp.findByPk(id);
        if (meetUp) {
            await meetUp.destroy();
            res.json({ message: 'MeetUp deleted successfully' });
        } else {
            res.status(404).json({ error: 'MeetUp not found' });
        }
    } catch (error) {
        next(error);
    }
}

async function registerForMeetUp(req, res, next) {
    const { userId, meetUpId } = req.body;
    try {
        const userMeetUp = await UserMeetUp.create({ userId, meetUpId });
        res.json(userMeetUp);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMeetUps,
    createMeetUp,
    updateMeetUp,
    deleteMeetUp,
    registerForMeetUp
};
