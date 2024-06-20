const {MeetUp} = require('../models/MeetUp');
const {User} = require('../models/User');

class MeetUpsRoutes {
  
    async getMeetUps() {
      const meetUps = await MeetUp.findAll();
      return meetUps;
    }

    async postMeetUp(name,description, tags, time, place, userId,role){
        if(role == "organizer"){
            const checkMeetUp = await MeetUp.findOne({where:{Name:name,Description:description,Tags:tags,Time:time,Place:place,serId:userId}})
            if(checkMeetUp){
                throw new Error(`MeetUp is already registered`);
            }
            const newMeetUP = await  MeetUp.create({Name:name,Description:description,Tags:tags,Time:time,Place:place,serId:userId})
            return newMeetUP;
        }else{
            throw  new Error(`You haven't enough privileges for creating MeetUps`);
        }
    }
}

exports.MeetUpsRoutes = MeetUpsRoutes;