const express = require('express')
const router = express.Router()
const auth = require('../controllers/checkToken')
const conversation = require('../controllers/conversation')

router.post('/chat', auth.checkToken, conversation.createConversation)

router.get('/chats', auth.checkToken, conversation.getConversations)
router.get('/chat', auth.checkToken, conversation.getConversation)

router.delete('/chat', auth.checkToken, conversation.deleteConversation)

module.exports = router