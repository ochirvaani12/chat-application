const express = require('express')
const router = express.Router()
const auth = require('../controllers/checkToken')
const message = require('../controllers/message')

router.post('/chat/message', auth.checkToken, message.createMessage)
router.get('/chat/messages', auth.checkToken, message.getMessages)

module.exports = router