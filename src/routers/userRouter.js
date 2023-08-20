const express = require("express");

const {
    userLogin,
    getUserInfo,
    refreshToken,
    userLogout,
    userRegister
} = require("../controllers/userController");

const userRouter = express.Router();

// 로그인
userRouter
    .route('/login')
    .post(userLogin);

// 로그인 유저 확인
userRouter
    .route('/accesstoken')
    .get(getUserInfo);

// Token 재발급
userRouter
    .route('/refreshtoken')
    .get(refreshToken);

// 로그아웃
userRouter
    .route('/logout')
    .post(userLogout);

// 회원가입
userRouter
    .route('/register')
    .post(userRegister);

module.exports = userRouter;