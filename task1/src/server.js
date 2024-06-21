const express = require('express');
const sequelize = require("./database/database");
const { MeetUp } = require("./models/MeetUp");
const url = require('url');
const { Op } = require("sequelize");
const { User } = require("./models/User");
const { RefreshToken } = require("./models/RefreshToken");
const { userSchema } = require("./validation/userValidate");
const { validate } = require("./validation/validMiddleware");
const { Registration } = require("./reg_auth/Registration");
const { Authorization } = require("./reg_auth/Authorization");
const { MeetUpsRoutes } = require("./routes/MeetUpsRoutes");
const app = express();
const tokenRoutes = require('./routes/TokenRoutes');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('./passport/passport');
app.use('/', tokenRoutes);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());
const router = new MeetUpsRoutes();

sequelize.sequelize.sync().then(() => {
    console.log("Tables are created successfully.");
}).catch((err) => {
    console.error(err);
});

app.post("/register", validate(userSchema), async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const {token, refreshToken} = await Registration(username, password, role);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/authorization", async (req, res) => {
    const { username, password } = req.body;
    try {
        const {token,refreshToken} = await Authorization(username, password);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const authenticateToken = passport.authenticate('jwt', { session: false });

app.get("/register", (req, res) => {
    res.send(`
        <form action="/register" method="post">
            <label>Username:</label><input type="text" name="username" required><br>
            <label>Password:</label><input type="password" name="password" required><br>
            <label>Role:</label><input type="text" name="role" required><br>
            <button type="submit">Register</button>
        </form>
    `);
});

app.get("/authorization", (req, res) => {
    res.send(`
        <form action="/authorization" method="post">
            <label>Username:</label><input type="text" name="username" required><br>
            <label>Password:</label><input type="password" name="password" required><br>
            <button type="submit">Login</button>
        </form>
    `);
});

app.get("/meetUps", authenticateToken, async (req, res) => {
    try {
        let { id, search, sortBy, filter, page, size } = req.query;
        page = parseInt(page) || 1;
        size = parseInt(size) || 5;

        let options = {};
        let Meets;

        if (id) {
            const singleMeet = await router.getMeetUpById(id);
            if (!singleMeet) {
                return res.status(404).json({ error: "Meetup not found" });
            }
            Meets = [singleMeet];
        } else {
            if (search) {
                options.where = {
                    Name: { [Op.like]: `%${search}%` }
                };
            }

            if (sortBy) {
                options.order = [[sortBy, 'ASC']];
            } else {
                options.order = [['id', 'ASC']];
            }

            if (filter) {
                options.where = {
                    ...options.where,
                    Tags: { [Op.like]: `%${filter}%` }
                };
            }

            const { count, rows } = await MeetUp.findAndCountAll({
                ...options,
                offset: (page - 1) * size,
                limit: size
            });

            Meets = rows;
            const totalPages = Math.ceil(count / size);

            let meetUpsHtml = `
                <button onclick="window.location.href='/createMeetUp'">Create MeetUp</button>
                <button onclick="window.location.href='/updateMeetUp'">Update MeetUp</button>
                <button onclick="window.location.href='/deleteMeetUp'">Delete MeetUp</button>
                <ul>`;

            Meets.forEach(meet => {
                meetUpsHtml += `<li>
                    <h3>${meet.Name}</h3>
                    <p>${meet.Description}</p>
                    <p>Tags: ${Array.isArray(meet.Tags) ? meet.Tags.join(', ') : meet.Tags}</p>
                    <p>Time: ${meet.Time}</p>
                    <p>Place: ${meet.Place}</p>
                    <form action="/registerMeetUp" method="post">
                        <input type="hidden" name="meetUpId" value="${meet.id}">
                        <button type="submit">Register</button>
                    </form>
                </li>`;
            });

            meetUpsHtml += '</ul>';

            meetUpsHtml += `
                <div>
                    <p>Page ${page} of ${totalPages}</p>
                    ${page > 1 ? `<a href="/meetUps?page=${page - 1}&size=${size}">Previous</a>` : ''}
                    ${page < totalPages ? `<a href="/meetUps?page=${page + 1}&size=${size}">Next</a>` : ''}
                </div>`;

            res.send(meetUpsHtml);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/createMeetUp", (req, res) => {
    res.send(`
        <form action="/meetUps" method="post">
            <label>Name:</label><input type="text" name="name" required><br>
            <label>Description:</label><input type="text" name="description" required><br>
            <label>Tags:</label><input type="text" name="tags" required><br>
            <label>Time:</label><input type="text" name="time" required><br>
            <label>Place:</label><input type="text" name="place" required><br>
            <button type="submit">Create</button>
        </form>
    `);
});

app.post("/updateMeetUp", authenticateToken, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user.id } });

    const { id, name, description, tags, time, place } = req.body;
    try {
        if(user.role!="organizer")
            throw new Error("you haven't enough privileges")
        const updates = { name, description, tags, time, place};
        const updatedMeetUp = await router.updateMeetUp(id, updates,user.id);
        res.redirect("/meetUps");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get("/updateMeetUp", (req, res) => {
    res.send(`
        <form action="/updateMeetUp" method="post">
            <label>ID:</label><input type="text" name="id" required><br>
            <label>Name:</label><input type="text" name="name" ><br>
            <label>Description:</label><input type="text" name="description"><br>
            <label>Tags:</label><input type="text" name="tags"><br>
            <label>Time:</label><input type="text" name="time"><br>
            <label>Place:</label><input type="text" name="place"><br>
            <button type="submit">Update</button>
        </form>
    `);
});

app.get("/deleteMeetUp", (req, res) => {
    res.send(`
        <form action="/deleteMeetUp" method="post">
            <label>ID:</label><input type="text" name="id" required><br>
            <button type="submit">Delete</button>
        </form>
    `);
});

app.post("/deleteMeetUp", authenticateToken, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { id } = req.body;
    try {
        if(user.role!="organizer")
            throw new Error("you haven't enough privileges")
        const deletedMeetUp = await router.deleteMeetUp(id,user.id);
        res.redirect("/meetUps");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/meetUps", authenticateToken, async (req, res) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { name, description, tags, time, place } = req.body;
    try {
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
        const newMeetUp = await router.postMeetUp(name, description, tagsArray, time, place, user.id, user.role);
        res.redirect("/meetUps");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/logout", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
       await RefreshToken.destroy({ where: { userId:req.user.id} });
        res.clearCookie('token');
        res.redirect("/authorization");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
