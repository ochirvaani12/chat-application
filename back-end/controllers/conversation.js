const ConversationSchema = require('../models/conversation')
const MessageSchema = require('../models/message')
const _ = require('lodash')

module.exports.createConversation = async function(req, res) {
    const checkConversation = await ConversationSchema.findOne({userIds: _.sortBy(req.body.userIds)})
    if(checkConversation) {
        res.json({ success: true , data: { conversationId: checkConversation._id}})
    }
    else {
        const conversation = new ConversationSchema({
            userIds: _.sortBy(req.body.userIds)
        })
        try {
            await conversation.save()
            res.json({ success: true , data: { conversationId: conversation._id}})
        } catch (error) {
            res.json({ success: false })
        }
    }
}

module.exports.getConversations = async function(req, res) {
    try {
        const conversations = await ConversationSchema.find({userIds: req.query.id})
        res.json({success: true, data: {conversations: conversations}})
    } catch (error) {
        res.json({success: false})
    }
    
}

module.exports.getConversation = async function(req, res) {
    try {
        const conversation = await ConversationSchema.findById(req.query.id)
        res.json({success: true, data: { userIds: conversation.userIds}})
    } catch (error) {
        res.json({success: false, data: { message: 'conversation is not found!!!'}})
    }
}

module.exports.deleteConversation = async function(req, res) {
    const deletedConversation = await ConversationSchema.findByIdAndRemove(req.body.id)
    if(deletedConversation){
        if(deletedConversation) {
            const deletedMessages = await MessageSchema.remove({conversationId: deletedConversation._id})
            res.json({success: true})
        }
    }
    else res.json({success: false, data: { message: 'conversation is not found!!!'}})
}