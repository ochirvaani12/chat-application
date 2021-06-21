const MessageSchema = require('../models/message')

module.exports.createMessage = async function(req, res) {
    const message = new MessageSchema({
        conversationId: req.body.conversationId,
        userId: req.body.userId,
        message: req.body.message
    })
    try {
        await message.save()
        res.json({ success: true })
    } catch (error) {
        res.json(error.message)
    }
}

module.exports.getMessages = async function(req, res) {
    try {
        const messages = await MessageSchema.find({
            conversationId: req.query.conversationId
        })
        res.json(messages)
    } catch (error) {
        res.json(error.message)
    }
    
}