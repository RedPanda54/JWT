const User = require("../models/User");
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const bcrypt = require("bcrypt");

// 로그인
exports.userLogin = async (req, res, next) => {
    const {
		email,
		password
	} = req.body;
    try{
        const user = await User.findOne({ email });
	
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error: "아이디 정보가 확인되지 않습니다.", success: false });
		}

        // accessToken 발급
        const accessToken = jwt.sign(
            { 
                userId: user._id,
                email: user.email
            }, process.env.ACCESS_SECRET,
            {
                expiresIn: '1h',
                issuer : 'Love Keeper'
            }
        );
    
        // refreshToken 발급
        const refreshToken = jwt.sign(
            {
                userId: user._id
            }, process.env.REFRESH_SECRET,
            {
                expiresIn: '24h',
                issuer : 'Love Keeper'
            }
        )

        // token 전송
        res.cookie('accessToken', accessToken, {
            secure : true,
            httpOnly : true,
        })

        res.cookie('refreshToken', refreshToken, {
            secure : true,
            httpOnly : true,
        })

        return res.status(200).json({ message: "로그인 처리되었습니다.", success: true, token: accessToken });

    }catch(error){
        console.error("Error in userLogin.", error);
        return res.status(500).json({ error: "Server error", success: false });
    }
}

// 로그인 유저
exports.getUserInfo = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ error: "AccessToken이 없습니다.", success: false });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        const userData = await User.findOne({ email: decoded.email });

        if (!userData) {
            return res.status(404).json({ error: "사용자 정보를 찾을 수 없습니다.", success: false });
        }

        const { password, ...userInfo } = userData.toObject(); // password를 제외한 사용자 정보

        return res.status(200).json(userInfo);
    } catch (error) {
        console.error("Error in getUserInfo.", error);
        return res.status(500).json({ error: "Server error", success: false });
    }
};

// 토큰 갱신
exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try{
        // accessToken을 갱신
        if (!refreshToken) {
            return res.status(401).json({ error: "유효하지 않은 refreshToken입니다.", success: false });
        }
        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        // accessToken 발급
        const accessToken = jwt.sign(
            { 
                userId: decoded._id,
                email: decoded.email
            }, process.env.ACCESS_SECRET,
            {
                expiresIn: '1h',
                issuer : 'Love Keeper'
            }
        );

        res.cookie('accessToken', accessToken, {
            secure : true,
            httpOnly : true,
        })

        return res.status(200).json({ message: "Token 재발급", success: true, token: accessToken });

    }catch(error){
        console.error("Error in userLogin.", error);
        return res.status(500).json({ error: "Server error", success: false });
    }       
}

// 로그아웃
exports.userLogout = async (req, res) => {
    try {
        res.clearCookie('accessToken'); // accessToken 쿠키를 삭제
        res.status(200).json("Logout success");
    } catch (error) {
        console.error("Error in userLogout.", error);
        return res.status(500).json({ error: "Server error", success: false });
    }
};


// 회원가입
exports.userRegister = async (req, res) => {
	const { 
		username,
		email,
		nickname,
		password,
		confirmPassword,
		phone,
		age,
		bloodType,
		startedDate,
		birthday
	} = req.body;
	try {
		// 이메일 중복 체크
		const existingUser = await User.findOne({ email });

		if (existingUser) {
		  return res.status(400).json({ error: "이미 사용중인 아이디입니다.", success: false });
		}

		// 비밀번호와 비밀번호 확인의 일치 여부
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "비밀번호가 일치하지 않습니다.", success: false });
		}
	
		// 비밀번호 암호화
		const hashedPassword = await bcrypt.hash(password, 10);

		// uuid 생성 (초대코드 10자리)
		const fullUuid = uuid.v4();
		const uuidString = fullUuid.substr(fullUuid.length - 10).toUpperCase();

		// 파일 url
		let imageUrl = "public/uploads/heart.png"; // 기본 이미지 URL
		if (req.file) {
			imageUrl = `public/uploads/${req.file.filename}`;
		}

		// 회원 정보를 DB에 저장
		const newUser = new User({
		  username,
		  email,
		  nickname,
		  password: hashedPassword,
		  phone,
		  age,
		  bloodType,
		  imageUrl,
		  connectCode: uuidString,
		  startedDate: new Date(startedDate),
		  birthday: new Date(birthday)
		});

		await newUser.save();
        
		console.log({ message: "Register success" })

		return res.status(200).json({ message: "회원가입에 성공하였습니다.", success: true, redirect: "/login" });

	  } catch (error) {
		console.error("Error in userRegister.", error);
		return res.status(500).json({ error: "Server error", success: false });
	  }
}