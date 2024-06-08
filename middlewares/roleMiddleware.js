const roleMiddleware = (role) => async (req, res, next) => {
    
    const user = req.user;
    
    if (role !== user.role) {
        return res.status(403).json({
            msg: 'Forbidden',
        })
    }

    next();

}

module.exports = roleMiddleware;