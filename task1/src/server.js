const express = require('express');
const sequelize = require("./database/database");
const {MeetUp} = require("./models/MeetUp");
const {User} = require("./models/User");
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

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
})