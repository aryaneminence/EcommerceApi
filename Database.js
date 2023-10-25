const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const { URL, SECRETKEY } = require('./config');

const Connection = async (app) => {
  try {
    await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Database Connected Successfully `);

    const mongoStore = MongoStore.create({
      mongoUrl: URL, 
      secret: SECRETKEY,
      touchAfter: 24 * 3600, // Time period in seconds
    });

    // Set up session middleware
    app.use(session({
      secret: SECRETKEY,
      resave: false,
      saveUninitialized: true,
      store: mongoStore,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session timeout in milliseconds (1 day in this example)
    }));

  } catch (error) {
    console.log(`Failure in Connection`, error);
  }
}

module.exports = Connection;
