const jwt = require('jsonwebtoken');
const jwtSecretKey = 'MY_JWT_SECRET_KEY123';
const UserModel = require('../models/auth');

const validateUser = async (req,res,next) => {
    
    const headers = req.headers;

    /**
     * Points to be validated in token
     * 1. Token should be present
     * 2. Secret key validation (This is the same token that we have generated)
     * 3. Token expiry date should not be passed
     * 4. Validate the issued at date (optional)
     * 5. Validate the user id if it is present in the database
     */

    // 1.
    if (!headers.authorization) {
        return res.status(401).json({
            msg: 'Unauthenticated user',
        })
    } 

    // 2.
    try {
        jwt.verify(headers.authorization, jwtSecretKey);
    } catch (err) {
        res.status(401).json({
            msg: 'Unauthenticated user',
        })
    }

    // 3.
    const tokenData = jwt.decode(headers.authorization);
    const tokenExp = tokenData.exp;
    const now = Math.ceil(new Date().getTime() / 1_000);

    if (tokenExp < now) {
        res.status(401).json({
            msg: 'Unauthenticated user',
        })
    }

    // 4.
    const iat = tokenData.iat;

    if (iat > now) {
        res.status(401).json({
            msg: 'Unauthenticated user',
        })
    }

    // 5.
    const userId = tokenData.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
        res.status(401).json({
            msg: 'Unauthenticated user',
        })
    }

    req.user = user;

    next();
}

module.exports = validateUser;
