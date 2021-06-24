const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const auth = require('../controllers/checkToken')

router.post('/signup', user.signup)
router.post('/login', user.login)
router.get('/username', auth.checkToken, user.getUsername)
router.get('/search', auth.checkToken, user.searchByUsername)
router.get('/getusers', auth.checkToken, user.getusers)


module.exports = router