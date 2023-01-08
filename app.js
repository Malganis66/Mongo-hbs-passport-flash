import "dotenv/config";
import express from "express";
import clientDB from './database/db.js';
import { create } from "express-handlebars";
import session, { Cookie } from "express-session";
import MongoStore from 'connect-mongo';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import flash from "connect-flash";
import passport from "passport";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import routeRoot from "./routes/home.js";
import routeLogin from "./routes/auth.js";
import User from "./models/User.js";

const app = express();

const corsOption = {
  Credentials: true,
  origin: process.env.foldPath || "*" ,
  methods: ['GET', 'POST']
}
app.use(cors())

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: "second-morse-code",
    store: MongoStore.create({
      clientPromise: clientDB,
      dbName: process.env.DBName
    }),
    cookie: {secure: process.env.MODO === 'production', maxAge: 30*24*60*60*1000}
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
);
passport.deserializeUser(async (user, done) => {
  const userDB = await User.findById(user.id);
  return done(null, { id: userDB._id, userName: userDB.userName });
});

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(mongoSanitize());

app.use((req,res,next)=>{
  res.locals.messages = req.flash('messages');
  next();
})

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use("/", routeRoot);
app.use("/auth", routeLogin);

const port = 3000;

app.listen(port, () => console.log("Server working"));
