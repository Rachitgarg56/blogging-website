const UserModel = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecretKey = 'MY_JWT_SECRET_KEY123';

const signUp = async (req,res) => {

    try {   
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new UserModel( { ...req.body, password: passwordHash } );
        const newlyInsertedUser = await newUser.save();
        
        res.status(200).json({
            success: true,
            msg:'Registered successfully',
        })
    } catch (err) {
        res.status(409).json({
            success: false,
            msg: 'Email is already registered',
        })  
    }

}

const login = async (req,res) => {

    const user = await UserModel.findOne( { email: req.body.email } );

    if (!user) {
        return res.status(404).json({
            msg: 'User not registered, please register first',
        })
    }

    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (isPasswordValid) {

        const tokenExpiry = Math.ceil(new Date().getTime() / 1_000) + 3600;
        const payload = {
            userId: user._id,
            name: user.name,
            exp: tokenExpiry,
        }

        const token = jwt.sign(payload,jwtSecretKey);

        return res.status(200).json({
            token,
        })
    }

    res.status(401).json({
        msg: 'Email or password is incorrect',
    })

}

const authController = {
    signUp, 
    login,
}

module.exports = authController;

