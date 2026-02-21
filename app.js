import dotenv from "dotenv";
dotenv.config();
const db_url = process.env.MONGO_URL;
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import engine from "ejs-mate";
import session from "express-session";
import flash from 'connect-flash';
import passport from "passport";
import LocalStrategy from 'passport-local';
import {User} from './models/user_model.js'
import { ExpressError } from "./utils/ExpressError.js";
import { router as listingsRouter } from "./routes/listing_route.js";
import { router as reviewsRouter } from "./routes/review_route.js";
import { router as userRouter } from "./routes/user_route.js";
import MongoStore from "connect-mongo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8080;
const app = express();
const store = MongoStore.create({
  mongoUrl : db_url,
  crypto: {
    secret : process.env.SECRET
  },
  touchAfter: 24*60*60
})

store.on("error",()=>{
  console.log("Error in Mongo Store");
  console.log(err);
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


async function startServer() {
  try {
    await mongoose.connect(db_url);
    console.log("Database connected successfully.");

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}.`);
    });
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
}

startServer();

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

// app.get('/',(req,res)=>{
//   res.send('Hi Iam root');
// })

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  res.locals.searchQuery = req.query.title || "";
  res.locals.selectedCategory = req.query.category || "";
  next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/review",reviewsRouter);
app.use('/',userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});
