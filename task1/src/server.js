const express = require('express');
const sequelize = require("./database/database");
const {MeetUp} = require("./models/MeetUp");
const {User} = require("./models/User");
const {userSchema} = require("./validation/userValidate");
const {validate} = require("./validation/validMiddleware");
const {Registration} = require("./reg_auth/Registration");
const {Authorization} = require("./reg_auth/Authorization");
const {MeetUpsRoutes} = require("./routes/MeetUpsRoutes");
const app = express();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const router = new MeetUpsRoutes();

sequelize.sequelize.sync().then(() => {
    "Tables are created successfully."
})
    .catch((err) => {
        console.error(err);
    });

app.post("/register",validate(userSchema), (req, res) => {

    const {username, password,role} = req.body;
    try {
       const token= Registration(username, password, role);
        res.cookie('token', token);
        res.redirect("/meetUps");
    } catch(error){
        res.status(500).json({ error: error.message });
    }
})

app.post("/authorization", (req, res) => {
    const {username, password,role} = req.body;
    try {
        const token= Authorization(username, password);
        res.cookie('token', token, {httpOnly: true });
        res.redirect("/meetUps");
    } catch(error){
        res.status(500).json({ error: error.message });
    }
})

const authenticateToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};
app.get("/meetUps", (req, res) => {
    try {
        const Meets = router.getMeetUps();
        res.send(Meets);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
})

app.post("/meetUps", authenticateToken, async (req,res)=>{

        const user = await User.findOne({id:req.user.userId});
        const {name,description, tags, time, place} = req.body;
        console.log(name,user.role)
    try{
        const newMeetUp = router.postMeetUp(name,description,tags,time,place,user.id,user.role);
        res.send(newMeetUp)
    }catch (error){
        res.status(500).json({error:error.message})
    }
})
app.listen(3000, () => {
    console.log(`Server running on port 3000`);
})