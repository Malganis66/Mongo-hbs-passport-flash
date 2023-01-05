import "dotenv/config";
import express from "express";
import "./database/db.js";
import { create } from "express-handlebars";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import routeRoot from "./routes/home.js";
import routeLogin from "./routes/auth.js";
import User from "./models/User.js";

const app = express();

app.use(
  session({
    secret: "kabin hana",
    resave: false,
    saveUninitialized: false,
    name: "second-morse-code",
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

app.use((req,res,next)=>{
  res.locals.messages = req.flash('messages');
  next();
})

app.use(express.static("/public/js/index.js"));
app.use(express.urlencoded({ extended: true }));

app.use("/", routeRoot);
app.use("/auth", routeLogin);

const port = 3000;

app.listen(port, () => console.log("Server working"));
