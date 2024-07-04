const express = require('express');
const sequelize = require('./database/database.js');
const { MeetUp } = require("./models/MeetUp.js");
const { UserMeetUp } = require("./models/UserMeetUp.js");
const url = require('url');
const { Op } = require("sequelize");
const { User } = require("./models/User.js");
const { RefreshToken } = require("./models/RefreshToken.js");
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
const swaggerRouter = require('./docs/swagger.js');

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500
        }
    });
}

const validateTime = (req, res, next) => {
    const { time } = req.body;
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (!time || timeRegex.test(time)) {
        next();
    } else {
        return res.status(400).json({ error: "Invalid time format. The correct format is HH:MM:SS" });
    }
};

app.use('/', tokenRoutes);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerRouter);
app.use(express.static('public'));
app.use(passport.initialize());
app.use(errorHandler);
app.use(validateTime)
const router = new MeetUpsRoutes();


sequelize.sequelize.sync().then(() => {
    console.log("Tables are created successfully.");
}).catch((err) => {
    console.error(err);
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
app.post("/register", validate(userSchema), async (req, res, next) => {
    const { username, password, role } = req.body;
    try {
        const { token, refreshToken } = await Registration(username, password, role);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /authorization:
 *   post:
 *     summary: User authorization
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to /meetUps
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example:
 *                 - token=yourAccessToken; HttpOnly
 *                 - refreshToken=yourRefreshToken; HttpOnly
 *       500:
 *         description: Server error
 */
app.post("/authorization", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const {token,refreshToken} = await Authorization(username, password);
        res.cookie('token', token, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
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

/**
 * @swagger
 * /meetUps:
 *   get:
 *     summary: Retrieve a list of meetups
 *     tags: [MeetUps]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: The ID of the meetup
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term for the meetup name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: A field to sort by
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: A filter term for the meetup tags
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A list of meetups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeetUp'
 *       500:
 *         description: Some server error
 */
app.get("/meetUps", authenticateToken, async (req, res, next) => {
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
            const registeredUsersCount = await UserMeetUp.count({ where: { meetUpId: id } });

            let meetUpHtml = `
                <h3>${singleMeet.Name}</h3>
                <p>${singleMeet.Description}</p>
                <p>Tags: ${Array.isArray(singleMeet.Tags) ? singleMeet.Tags.join(', ') : singleMeet.Tags}</p>
                <p>Time: ${singleMeet.Time}</p>
                <p>Place: ${singleMeet.Place}</p>
                <p>Registered Users: ${registeredUsersCount}</p>
                <form action="/registerMeetUp" method="post">
                    <input type="hidden" name="meetUpId" value="${singleMeet.id}">
                    <button type="submit">Register</button>
                </form>
            `;
            return res.send(meetUpHtml);
        }

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
                Tags: {
                    [Op.contains]: [filter]
                }
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

        for (const meet of Meets) {
            const registeredUsersCount = await UserMeetUp.count({ where: { meetUpId: meet.id } });

            meetUpsHtml += `<li>
                <h3>${meet.Name}</h3>
                <p>${meet.Description}</p>
                <p>Tags: ${Array.isArray(meet.Tags) ? meet.Tags.join(', ') : meet.Tags}</p>
                <p>Time: ${meet.Time}</p>
                <p>Place: ${meet.Place}</p>
                <p>Registered Users: ${registeredUsersCount}</p>
                <form action="/registerMeetUp" method="post">
                    <input type="hidden" name="meetUpId" value="${meet.id}">
                    <button type="submit">Register</button>
                </form>
            </li>`;
        }

        meetUpsHtml += '</ul>';

        meetUpsHtml += `
            <div>
                <p>Page ${page} of ${totalPages}</p>
                ${page > 1 ? `<a href="/meetUps?page=${page - 1}&size=${size}">Previous</a>` : ''}
                ${page < totalPages ? `<a href="/meetUps?page=${page + 1}&size=${size}">Next</a>` : ''}
            </div>`;

        res.send(meetUpsHtml);

    } catch (error) {
        next(error);
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

/**
 * @swagger
 * /meetUps:
 *   put:
 *     summary: Update a MeetUp
 *     tags: [MeetUps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               time:
 *                 type: string
 *               place:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to /meetUps
 *       500:
 *         description: Server error
 */
app.put("/meetUps", authenticateToken, validateTime, async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.id } });

    const { id, name, description, tags, time, place } = req.body;
    try {
        if(user.role!="organizer")
            throw new Error("you haven't enough privileges")
        const updates = { name, description, tags, time, place};
        const updatedMeetUp = await router.updateMeetUp(id, updates,user.id);
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
});

app.get("/updateMeetUp", (req, res) => {
    res.send(`
        <form id="updateForm">
            <label>ID:</label><input type="text" name="id" required><br>
            <label>Name:</label><input type="text" name="name"><br>
            <label>Description:</label><input type="text" name="description"><br>
            <label>Tags:</label><input type="text" name="tags"><br>
            <label>Time:</label><input type="text" name="time"><br>
            <label>Place:</label><input type="text" name="place"><br>
            <button type="submit">Update</button>
        </form>
        <script>
            document.getElementById('updateForm').addEventListener('submit', async function(event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const data = Object.fromEntries(formData);
                const response = await fetch('/meetUps', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    window.location.href = '/meetUps';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            });
        </script>
    `);
});

app.get("/deleteMeetUp", (req, res) => {
    res.send(`
        <form id="deleteForm">
            <label>ID:</label><input type="text" name="id" required><br>
            <button type="submit">Delete</button>
        </form>
        <script>
            document.getElementById('deleteForm').addEventListener('submit', async function(event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const data = Object.fromEntries(formData);
                const response = await fetch('/meetUps', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    window.location.href = '/meetUps';
                } else {
                    const errorData = await response.json();
                    alert(errorData.error);
                }
            });
        </script>
    `);
});

/**
 * @swagger
 * /meetUps:
 *   delete:
 *     summary: Delete a MeetUp
 *     tags: [MeetUps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       302:
 *         description: Redirect to /meetUps
 *       500:
 *         description: Server error
 */
app.delete("/meetUps", authenticateToken, async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { id } = req.body;
    try {
        if(user.role!="organizer")
            throw new Error("you haven't enough privileges")
        const deletedMeetUp = await router.deleteMeetUp(id,user.id);
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /meetUps:
 *   post:
 *     summary: Create a new MeetUp
 *     tags: [MeetUps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: string
 *               time:
 *                 type: string
 *               place:
 *                 type: string
 *             example:
 *               name: "Example MeetUp"
 *               description: "This is an example MeetUp"
 *               tags: "tech, networking"
 *               time: "14:00:00"
 *               place: "Virtual"
 *     responses:
 *       302:
 *         description: Redirect to /meetUps
 *       500:
 *         description: Server error
 */
app.post("/meetUps", authenticateToken, validateTime, async (req, res, next) => {
    const user = await User.findOne({ where: { id: req.user.id } });
    const { name, description, tags, time, place } = req.body;
    try {
        const tagsArray = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
        const newMeetUp = await router.postMeetUp(name, description, tagsArray, time, place, user.id, user.role);
        res.redirect("/meetUps");
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout and clear session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */

app.get("/logout", authenticateToken, async (req, res, next) => {
    const userId = req.user.userId;
    try {
       await RefreshToken.destroy({ where: { userId:req.user.id} });
        res.clearCookie('token');
        res.redirect("/authorization");
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /registerMeetUp:
 *   post:
 *     summary: Register a user for a meetup
 *     tags: [UserMeetUp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               meetUpId:
 *                 type: integer
 *                 description: The ID of the meetup to register
 *             required:
 *               - meetUpId
 *             example:
 *               meetUpId: 1
 *     responses:
 *       200:
 *         description: User registered for the meetup successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


app.post("/registerMeetUp", authenticateToken, async (req, res, next) => {
    try {
        const { meetUpId } = req.body;
        const userId = req.user.id;

        await UserMeetUp.create({ userId, meetUpId });

        res.redirect(`/meetUps`);
    } catch (error) {
        next(error);
    }
});


app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
