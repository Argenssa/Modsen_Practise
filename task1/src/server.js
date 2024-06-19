const express = require('express');
const sequelize = require("./database/database");
const {MeetUp} = require("./models/MeetUp");
const {User} = require("./models/User");
const {userSchema} = require("./validation/userValidate");
const {validate} = require("./validation/validMiddleware");
const {Registration} = require("./reg_auth/Registration");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


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
        res.redirect("/resource");
    } catch(error){
        res.status(500).json({ error: error.message });
    }

})

app.get("/resource", (req, res) => {
    
})

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
})