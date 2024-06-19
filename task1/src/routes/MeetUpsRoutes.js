const {MeetUp} = require('../models/MeetUp');
const {User} = require('../models/User');

class MeetUpsRoutes {
  
    async getMeetUps() {
      const meetUps = await MeetUp.findAll();
      return meetUps;
    }

}

exports.MeetUpsRoutes = MeetUpsRoutes;