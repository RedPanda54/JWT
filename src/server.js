require("./db");
const express = require("express");
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require("morgan");

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

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: 'http://localhost:${process.env.PORT}',
    methods: ['GET', 'POST'],
    credentials: true
}))

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ kakaoId: profile.id });

        if (!user) {
            user = new User({
                kakaoId: profile.id,
                displayName: profile.displayName
            });

            await user.save();
        }

        return done(null, user);

    } catch (error) {
        return done(error, false);
    }
}));


app.use('/', userRouter);
app.use('/', kakaoRouter);

module.exports = app;