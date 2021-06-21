const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const auth = require('../controllers/checkToken')

router.post('/signup', user.signup)
router.post('/login', user.login)
router.get('/usernames', auth.checkToken, user.getUsernames)
router.get('/search', auth.checkToken, user.searchByUsername)

module.exports = router