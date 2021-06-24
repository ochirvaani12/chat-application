const MessageSchema = require('../models/message')

module.exports.createMessage = async function(req, res) {
    const message = new MessageSchema({
        conversationId: req.body.conversationId,
        userId: req.body.userId,
        message: req.body.message
    })
    try {
        await message.save()
        res.json({ success: true, data: { message: message} })
    } catch (error) {
        res.json({ success: false })
    }
}

module.exports.getMessages = async function(req, res) {
    try {
        const messages = await MessageSchema.find({
            conversationId: req.query.conversationId
        })
        res.json({success: true, data: { messages: messages}})
    } catch (error) {
        res.json({success: false})
    }
    
}

module.exports.deleteMessage = async function(req, res) {
    const deletedMessage = await MessageSchema.findByIdAndDelete(req.body.messageId)
    if(deletedMessage) {
        res.json({success: true, data: { message: deletedMessage}})
    } else {
        res.json({success: false})
    }
}