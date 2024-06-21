const { MeetUp } = require('../models/MeetUp');
const { User } = require('../models/User');

class MeetUpsRoutes {
    async getMeetUps() {
        const meetUps = await MeetUp.findAll();
        return meetUps;
    }

    async getMeetUpById(id) {
        const meetUp = await MeetUp.findByPk(id);
        return meetUp;
    }

    async getMeetUpByName(name) {
        const meetUp = await MeetUp.findAll({where:{Name:name}});
        return meetUp;
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

    async updateMeetUp(id, updates,userId) {
        const meetUp = await MeetUp.findOne({ where: { id: id } });
        if (!meetUp) {
            throw new Error(`MeetUp not found`);
        }
        if(meetUp.userId!=userId)
            throw new Error(`It isn't your meetUp`);
        if (updates.name) meetUp.Name = updates.name;
        if (updates.description) meetUp.Description = updates.description;
        if (updates.tags) {
            const tagsArray = Array.isArray(updates.tags) ? updates.tags : updates.tags.split(',').map(tag => tag.trim());
            meetUp.Tags = tagsArray;
        }
        if (updates.time) meetUp.Time = updates.time;
        if (updates.place) meetUp.Place = updates.place;

        await meetUp.save();
        return meetUp;
    }


    async deleteMeetUp(id,userId) {
        const meetUp = await MeetUp.findOne({ where: { id: id } });

        if (!meetUp) {
            throw new Error(`MeetUp not found`);
        }
        if(meetUp.userId!=userId)
            throw new Error(`It isn't your meetUp`);
            await meetUp.destroy();
        return { message: `MeetUp with id ${id} deleted` };
    }
}

exports.MeetUpsRoutes = MeetUpsRoutes;
