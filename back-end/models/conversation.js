const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    userIds: [{
        type: String
    }]
})

module.exports = mongoose.model('Conversation', ConversationSchema)