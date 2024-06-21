const { MeetUp } = require('../models/MeetUp');
const { User } = require('../models/User');

class MeetUpsRoutes {
    async getMeetUps() {
        const meetUps = await MeetUp.findAll();
        return meetUps;
    }

    async postMeetUp(name, description, tags, time, place, userId, role) {
        if (role === "organizer") {
            const checkMeetUp = await MeetUp.findOne({ where: { Name: name, Description: description, Tags: tags, Time: time, Place: place, userId: userId } });
            if (checkMeetUp) {
                throw new Error(`MeetUp is already registered`);
            }
            const newMeetUP = await MeetUp.create({ Name: name, Description: description, Tags: tags, Time: time, Place: place, userId: userId });
            return newMeetUP;
        } else {
            throw new Error(`You haven't enough privileges for creating MeetUps`);
        }
    }

    async updateMeetUp(id, name, description, tags, time, place) {
        const meetUp = await MeetUp.findOne({ where: { id: id } });
        if (!meetUp) {
            throw new Error(`MeetUp not found`);
        }
        meetUp.Name = name;
        meetUp.Description = description;
        meetUp.Tags = tags;
        meetUp.Time = time;
        meetUp.Place = place;
        await meetUp.save();
        return meetUp;
    }

    async deleteMeetUp(id) {
        const meetUp = await MeetUp.findOne({ where: { id: id } });
        if (!meetUp) {
            throw new Error(`MeetUp not found`);
        }
        await meetUp.destroy();
        return { message: `MeetUp with id ${id} deleted` };
    }
}

exports.MeetUpsRoutes = MeetUpsRoutes;
