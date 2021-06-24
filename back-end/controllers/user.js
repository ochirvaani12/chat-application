const UserSchema = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const joi = require('joi')
require('dotenv/config')

module.exports.signup = async function (req, res) {
    const validation = joi.object().keys({
        firstname: joi.string().alphanum().min(1).required(),
        lastname: joi.string().alphanum().min(1).required(),
        username: joi.string().min(1).required(),
        password: joi.string().min(4).max(72).required()
    })

    const { value, error } = validation.validate(req.body)
    if(error) {
        res.json({ success: false, data: { message: 'invalid input'}})
    }
    else {
        const user = new UserSchema({
            firstname: value.firstname,
            lastname: value.lastname,
            username: value.username,
            hashPassword: await bcrypt.hash(value.password, 10)
        })
        try {
            await user.save()
            let token = jwt.sign({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
            }, process.env.JWT_KEY)
            res.json({ success: true, data: { token: token } })
        } catch (error) {
            res.json(error.message)
        }
    }
}

module.exports.login = async function (req, res) {
    const user = await UserSchema.findOne({ username: req.body.username });
    if (user) {
        if (bcrypt.compare(req.body.password, user.hashPassword)) {
            let token = jwt.sign({
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
            }, process.env.JWT_KEY)
            res.json({ success: true, data: { token: token } })
        }
        else res.json({ success: false, data: { message: 'password or username is wrong' } })
    } else res.json({ success: false, data: { message: 'password or username is wrong' } })
}

module.exports.getUsername = async function (req, res) {
    try {
        const user = await UserSchema.findById(req.query.id)
        res.json({success: true, data: {username: user.username, id: user._id}});
    } catch (error) {
        res.json({success: false, data: { message: 'user is not found!!!'}})
    }
}

module.exports.searchByUsername = async function (req, res) {
    try {
        const user = await UserSchema.findOne({username: req.query.username})
        res.json({success: true, data: {username: user.username, id: user._id}});
    } catch (error) {
        res.json({success: false, data: { message: 'user is not found!!!'}})
    }
}

module.exports.getusers = async function (req, res) {
    try {
        const users = await UserSchema.find({})
        res.json({success: true, data: {users: users}})
    } catch(error) {
        res.json({success: false, data: { message: 'server error'}})
    }
}