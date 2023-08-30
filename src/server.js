require("./db");
const express = require("express");
const session = require("express-session");
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require("morgan");
const User = require('./models/User');

// Routers
const userRouter = require("./routers/userRouter.js");
const kakaoRouter = require("./routers/kakaoRouter.js");

const app = express();

app.use(morgan("dev"));
app.set('view engine', 'ejs');
app.set("views", "src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['your-secret-key'],
    maxAge: 24 * 60 * 60 * 1000 // 세션 유효기간 (1일)
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:${process.env.PORT}',
    methods: ['GET', 'POST'],
    credentials: true
}))

require('./auth/kakaoStrategy')(passport);

app.use('/', userRouter);
app.use('/', kakaoRouter);

module.exports = app;