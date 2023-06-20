const session= require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
    app.set('trust proxy', 1);

    app.use(
        session({
            secret: 'solid end to end secret',
            resave: true,
            saveUninitialized: true,
            store: MongoStore.create({
                mongoUrl:  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/extra-lab-irohnhack",

            }),
            cookie: {
            httpOnly: true,
            maxAge: 600000
            },
        })
    );
};