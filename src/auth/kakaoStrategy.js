const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: process.env.KAKAO_REDIRECT_URI
    }, async function(accessToken, refreshToken, profile, done) {
        try {
            // 카카오로부터 받아온 사용자 정보
            const kakaoId = profile.id;
            const username = profile.username;
            const email = profile._json.kakao_account.email;
            
            let user = await User.findOne({ kakaoId });

            if (!user) {
                user = new User({
                    kakaoId,
                    username,
                    email
                });
                await user.save(); 
            }

            return done(null, user);

        } catch (error) {
            return done(error, null);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
};