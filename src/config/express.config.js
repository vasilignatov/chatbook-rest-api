const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const routes = require('../routes/routes');
const errorHandler = require('../middlewares/error');
const passport = require('passport');
const jwtStrategy = require('../config/passport.config');
const compression = require('compression');
const dbConnect = require('./mongoose.config');


async function expressConfig(app) {
    // config and connect mongoose;
    dbConnect();
    // set HTTP headers properly
    app.use(helmet());

    // Middleware to enable CORS
    app.use(cors({
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3100"],
        credentials: true, 
    }));

    // Middleware to parse requests with JSON payloads
    app.use(express.json({limit: '35mb'}));

    // Sanitize request data
    app.use(xss());
    app.use(mongoSanitize());

    // Middleware to parse URL-encoded da
    app.use(express.urlencoded({
        extended: true,
        limit: '35mb'
    }));

    // Middleware to compress response 
    app.use(compression());

    // Setup passport (use JWT)
    app.use(passport.initialize());
    passport.use('jwt', jwtStrategy);

    // Add modular router
    app.use(routes);

    // Global Error Handler
    app.use(errorHandler);
}

module.exports = expressConfig;
