const express = require('express')
const { register, login } = require('../controllers/authController')
const protect = require('../middlewares/auth')
const authorizeRoles = require('../middlewares/roleMiddleware')
const router = express.Router()

router.post('/register', register)
router.post('/login', login)

//protected route for testing token validation
router.get('/test', protect, (req,res) => {
    res.json({
        msg: 'you have access to this protected route',
        user: req.user
    })
})

//  Route only accessible to admins
router.get('/admin', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    msg: 'Welcome Admin 👑',
    user: req.user});
})

module.exports = router