const UserSchema = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv/config')

module.exports.checkToken = function(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_KEY)
        if(decoded) next()
        else res.json({success: false})
    } else res.json({success: false})
}