const express = require('express');
const kakaoRouter = express.Router();
const passport = require('passport');

kakaoRouter.get('/', (req, res) => {
    res.render('index'); // index.ejs 뷰 렌더링
});

kakaoRouter.get('/auth/kakao', passport.authenticate('kakao'));

kakaoRouter.get('/auth/kakao/callback',
    passport.authenticate('kakao', {
        failureRedirect: '/',
        successRedirect: '/profile'
    })
);

kakaoRouter.get('/profile', (req, res) => {
    res.render('profile', { user: req.user }); // profile.ejs 뷰 렌더링
});

module.exports = kakaoRouter;
