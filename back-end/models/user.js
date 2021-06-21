const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlenght: 2
    },
    lastname: {
        type: String,
        required: true,
        minlenght: 2
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlenght: 2
    },
    hashPassword: {
        type: String,
        required: true,
        minlenght: 4
    }
})

module.exports = mongoose.model('User', UserSchema)